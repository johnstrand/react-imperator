import * as React from "react";

import { ContextCallback, CallbackRegistration, Callback, Func, IndexedObject, VoidAction2 } from "./Types";
import { generateName, distinct, exclude } from "./Utils";

type Imperator = {
    update: <T>(context: string, producer: (state: T) => T) => void,
    connect: <S>(Component: React.ComponentType<S>, contexts?: string[], excludedContexts?: string[]) => React.ComponentType<S>
}
export module ReactImperator {
    export const { update, connect }: Imperator = (() => {
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
                contexts?: string[],
                excludedContexts?: string[]
            ): React.ComponentType<S> {

                const forEachProp = (props: S, callback: (prop: string) => void) => {
                    const propContexts: string[] = Object.keys(props);
                    const suppliedContexts: string[] = contexts || [];
                    exclude(distinct(propContexts.concat(suppliedContexts)), (excludedContexts || [])).forEach(callback);
                }

                return class extends React.Component<S, S> {
                    private name: string;
                    constructor(props: S) {
                        super(props);
                        this.name = generateName();

                        forEachProp(props, context => {
                            registerCallback(context, this.name, value => {
                                if (!context) {
                                    return;
                                }
                                const newState: IndexedObject = { [context]: value };
                                this.setState((state: S) => ({ ...(state as {}), ...newState }));
                            });

                            // If the current context comes from a component prop AND
                            // the context doesn't already have a value, take the property value
                            if ((props as IndexedObject)[context] && !contextState[context]) {
                                const value: IndexedObject = (props as IndexedObject)[context];
                                contextState[context] = value;
                            }
                        });

                        this.setState(contextState as S);
                    }

                    render(): JSX.Element {
                        return <Component {...this.state} />;
                    }

                    componentWillMount(): void {
                        forEachProp(this.props, context => {
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
}