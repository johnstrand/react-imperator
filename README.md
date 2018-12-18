# react-imperator

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