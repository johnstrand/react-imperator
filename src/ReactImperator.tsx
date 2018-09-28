import * as React from "react";

import { ContextCallback, CallbackRegistration, Callback, Func, IndexedObject, VoidAction2 } from "./Types";
import { generateName, distinct } from "./Utils";

export const { update, connect } = (() => {
    // Tracks all of the context callbacks, with the structure
    // callbacks.context.consumer = callback
    const callbacks: ContextCallback = {};

    // Tracks the last value specified for each context
    const contextState: { [key: string]: any } = {};

    // Registers a callback for a specific combination of context and consumer
    const registerCallback: CallbackRegistration = (
        context: string,
        consumer: string,
        callback: Callback
    ): void => {
        // If this specific context has never been seen before, populate the root object
        if (!callbacks[context]) {
            callbacks[context] = {};
        }
        // Assign the callback to the context/consumer combo
        callbacks[context][consumer] = callback;
    };

    const unregister: Func<string, void> = (consumer: string) => {
        // Remove the specified consumer entry for each context
        Object.keys(callbacks).forEach(context => delete callbacks[context][consumer]);
    };

    const updateContext: VoidAction2<string, any> = (context: string, state: any) => {
        Object.keys(callbacks[context]).forEach(subscriber => {
            const callback: Callback = callbacks[context][subscriber];
            if (!callback) {
                return;
            }
            callback(state);
        });
    };

    return {
        update: function <T>(context: string, producer: (state: T) => T): void {
            if (!callbacks[context]) {
                return;
            }

            const state: any = producer(contextState[context]);
            contextState[context] = state;
            updateContext(context, state);
        },
        connect: function <S>(
            Component: React.ComponentType<S>,
            contexts?: string[]
        ): React.ComponentType<S> {
            return class extends React.Component<S, S> {
                private name: string;
                constructor(props: S) {
                    super(props);
                    this.name = generateName();
                    const propContexts: string[] = Object.keys(props);
                    distinct(propContexts.concat(contexts || [])).forEach(context => {
                        registerCallback(context, this.name, value => {
                            if (!context) {
                                return;
                            }
                            const newState: IndexedObject = { [context]: value };
                            this.setState((state: S) => ({ ...(state as {}), ...newState }));
                        });

                        // If the current context comes from a component prop AND
                        // the context doesn't already have a value, take the property value
                        if (propContexts.indexOf(context) > -1 && !contextState[context]) {
                            const value: IndexedObject = (props as IndexedObject)[context];
                            contextState[context] = value;
                        }
                    });
                }

                render(): JSX.Element {
                    return <Component {...this.state} />;
                }

                componentWillMount(): void {
                    const propContexts: string[] = Object.keys(this.props);
                    let extraContext: string[] = contexts || [];

                    distinct(propContexts.concat(extraContext)).forEach(context => {
                        update<any>(context, value => value);
                    });
                }

                componentWillReceiveProps(props: S): void {
                    this.setState(props);
                }

                componentWillUnmount(): void {
                    unregister(this.name);
                }
            };
        }
    };
})();