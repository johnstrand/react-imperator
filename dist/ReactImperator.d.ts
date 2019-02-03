import * as React from "react";
export declare function createStore<StoreState>(initialState: StoreState): {
    subscribe<T extends keyof StoreState>(context: T, callback: (value: StoreState[T]) => void): string;
    unsubscribe(name: string): void;
    get<T extends keyof StoreState>(context: T): StoreState[T];
    update<T extends keyof StoreState>(context: T, reducer: (state: StoreState[T]) => StoreState[T]): void;
    connect<LocalState>(Component: React.ComponentType<LocalState>, mapStoreToLocal: (state: StoreState) => LocalState): React.ComponentType<LocalState>;
};
