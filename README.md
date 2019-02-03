# react-imperator 2.0
This is a state container that automatically (more or less) injects updated properties into connected components. Starting with 2.0, the architecture is rewritten to be more helpful and automagic. Please note that 2.0 is not backwards compatible with 1.0, though it shouldn't be overly hard to convert.

The package exposes a single method: 

## CreateStore

```typescript
function createStore<StoreState>(initialState: StoreState)
```

This method is responsible for creating the initial store based on the supplied value, and then exposing the following methods:

## Subscribe

```typescript
subscribe<T extends StoreProp>(context: T, callback: Callback<T>): string
```

subscribe is mainly used for services, a component would normally not depend on it. It takes the following arguments:
* a type argument extending StoreProp (which in turn is an alias for keyof StoreState)
* a context of type T
* a callback accepting a parameter of type StoreState[T]

The method returns a randomly generated name, which can be used to cancel a subscription

## Unsubscribe

```typescript
unsubscribe(name: string): void
```
unsubscribe is the reverse of subscribe, and removes all subscriptions of a specified name.

## Get

```typescript
get<T extends StoreProp>(context: T): StoreState[T]
```
get accepts a context of type T, and returns its current value. This is mainly used for components and services that don't necessarily want to subscribe to a specific context, but still might require its value

## Update

```typescript
update<T extends StoreProp>(context: T, reducer: (state: StoreState[T]) => StoreState[T]): void
```
update takes two arguments:
* A context to update
* A callback that receives the current state of the context, and is expected to return the new state

## Connect

```typescript
connect<LocalState>(Component: React.ComponentType<LocalState>, mapStoreToLocal: (state: StoreState) => LocalState): React.ComponentType<LocalState>
```
connect takes two arguments:
* A component, may be stateless or stateful
* A callback used to derive local state from the global state

## Simple example

State.ts
```typescript
import { createStore } from "react-imperator";

export interface IListState {
    items: IListItem[];
    text: string;
}

export interface IListItem {
    text: string;
    done: boolean;
    id: number;
}

export type StateMap<StoreState, LocalState> = (
    state: StoreState
) => LocalState;

export const { connect, get, update } = createStore<IListState>({
    items: [],
    text: ""
});
```

ListItems.tsx
```typescript
import * as React from "react";
import { IListState, StateMap, connect, IListItem, update } from "./State";
import { AddItem } from "./AddItem";

interface IListItemsProps {
    list: IListItem[];
    text?: string;
}

const stateMap: StateMap<IListState, IListItemsProps> = (
    state: IListState
) => ({
    list: state.items || [],
    text: state.text
});

const handleToggle = (id: number) => (
    e: React.SyntheticEvent<HTMLInputElement>
) => {
    update("items", items =>
        items.map(item => {
            return item.id === id
                ? { ...item, ...{ done: e.currentTarget.checked } }
                : item;
        })
    );
};

export const ListItems = connect<IListItemsProps>(
    (props: IListItemsProps) => {
        return (
            <div>
                <ul>
                    {props.list.map(item => (
                        <li key={item.id}>
                            <input
                                type="checkbox"
                                checked={item.done}
                                onChange={handleToggle(item.id)}
                            />
                            {item.text}
                        </li>
                    ))}
                    <li>
                        <AddItem text="" />
                    </li>
                </ul>
            </div>
        );
    },
    stateMap
);
```

AddItem.tsx
```typescript
import * as React from "react";
import { update, StateMap, IListState, connect } from "./State";

interface IAddItemProps {
    text: string;
}

const stateMap: StateMap<IListState, IAddItemProps> = (state: IListState) => ({
    text: state.text
});

export const AddItem : React.ComponentType<IAddItemProps> = connect(class extends React.Component<IAddItemProps, {}> {

    handleInput = (e: React.KeyboardEvent) => {
        if(e.which !== 13 || !this.props.text) {
            return;
        }

        this.handleAdd();
    }
    handleTextChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        update("text", () => e.currentTarget.value);
    }

    handleAdd = () => {
        update("items", state => [...state, { text: this.props.text, done: false, id: state.length + 1 }]);
        update("text", () => "");
    }

    render(): JSX.Element {
        return (
            <div>
                <div>
                    <input value={this.props.text || ""} onChange={this.handleTextChange} onKeyDown={this.handleInput} />
                    <button onClick={this.handleAdd}>Add</button>
                </div>
            </div>
        );
    }
}, stateMap);
```

# react-imperator 1.0

This is a state container that automatically (more or less) injects updated properties into connected components.

The package exposes two methods, connect and update.

## Connect

```typescript
connect: <S>(Component: React.ComponentType<S>, contexts?: string[], excludedContexts?: string[]) => React.ComponentType<S>;
```

connect() takes three arguments:
* A component, may be stateless or stateful
* A list of contexts to force subscription (optional)
   * This is useful when you want to declare a property as optional, yet still want to add a subscription
* A list of contexts to ignore (optional)

and returns a wrapped component

## Update
```typescript
update: <T>(context: string, producer: (state: T) => T) => void;
```

update() takes two arguments:
* A context to update
* A callback that receives the current state of the context, and is expected to return the new state

## Simple example
ShowCount.tsx - Subscribes to the context "count", explicitly specified
```typescript
import * as React from "react";
import { connect } from "react-imperator";

export const ShowCount = connect((props: { count?: number}) => <div>{props.count || 0}</div>, ["count"]);
```

Incrementer.tsx - Will update the context "count"
```typescript
import * as React from "react";
import { update } from "react-imperator";

const click = () => {
    update<number>("count", value => (value || 0) + 1)
}

export const Incrementer = () => <button onClick={click}>Click me</button>;
```

## New in 1.0.11
Imperator now exposes two additional methods:
```typescript
subscribe: function<T>(context: string, callback: (state: T) => void): string;
unsubscribe: function(name: string): void;
```

These are helper methods to allow service classes and similar to monitor context changes.
subscribe() takes two arguments:
* A context to monitor
* A callback to invoke when context changes
And returns a random identifier for a subscription

unsubscribe() takes a single argument:
* The subscription name to revoke (output from subscribe method)