import * as React from 'react';
export declare const connect: <S>(Component: React.ComponentType<S>, contexts?: string[], excludedContexts?: string[]) => React.ComponentType<S>, update: <T>(context: string, producer: (state: T) => T) => void, subscribe: <T>(context: string, callback: (state: T) => void) => string, unsubscribe: (name: string) => void, get: <T>(context: string) => T;
