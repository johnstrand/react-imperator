import * as React from 'react';

const generateName: () => string = (): string =>
    Math.random()
        .toString(36)
        .substring(7);

export function createStore<StoreState>(initialState: StoreState) {
    interface IDictionary<T> {
        [key: string]: T;
    }
    type Notifier = () => void;
    type StoreProp = keyof StoreState;
    type Callback<T extends StoreProp> = (value: StoreState[T]) => void;

    const store: StoreState = initialState;
    const storeCallbacks: IDictionary<Notifier> & object = {};
    const subscriberCallbacks: IDictionary<IDictionary<(value: any) => void>> &
        object = {};

    return {
        subscribe<T extends StoreProp>(
            context: T,
            callback: Callback<T>
        ): string {
            const name: string = generateName();
            if (!subscriberCallbacks.hasOwnProperty(context)) {
                subscriberCallbacks[context as string] = {};
            }
            subscriberCallbacks[context as string][name] = callback;
            return name;
        },
        unsubscribe(name: string): void {
            Object.getOwnPropertyNames(subscriberCallbacks).forEach(
                (context) => {
                    delete subscriberCallbacks[context][name];
                }
            );
        },
        get<T extends StoreProp>(context: T): StoreState[T] {
            return store[context];
        },
        update<T extends StoreProp>(
            context: T,
            reducer: (state: StoreState[T]) => StoreState[T]
        ): void {
            const newState: StoreState[T] = reducer(store[context]);
            store[context] = newState;

            Object.getOwnPropertyNames(storeCallbacks).forEach((name) => {
                storeCallbacks[name]();
            });

            if (subscriberCallbacks.hasOwnProperty(context)) {
                Object.getOwnPropertyNames(
                    subscriberCallbacks[context as string]
                ).forEach((subscriber) => {
                    subscriberCallbacks[context as string][subscriber](
                        newState
                    );
                });
            }
        },
        connect<LocalState>(
            Component: React.ComponentType<LocalState>,
            mapStoreToLocal: (state: StoreState) => Partial<LocalState>
        ): React.ComponentType<LocalState> {
            return class extends React.Component<LocalState, LocalState> {
                private name: string;
                constructor(props: LocalState) {
                    super(props);
                    this.name = generateName();
                    this.state = mapStoreToLocal({
                        ...props,
                        ...store,
                    }) as Readonly<LocalState>;

                    storeCallbacks[this.name] = () =>
                        this.setState(mapStoreToLocal(store) as Readonly<
                            LocalState
                        >);
                }

                public render(): JSX.Element {
                    return <Component {...{ ...this.props, ...this.state }} />;
                }

                public componentWillUnmount(): void {
                    Object.getOwnPropertyNames(storeCallbacks).forEach(
                        (context) => {
                            delete storeCallbacks[context][name];
                        }
                    );
                }
            };
        },
    };
}
