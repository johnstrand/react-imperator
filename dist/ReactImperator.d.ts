import * as React from "react";
export declare const update: <T>(context: string, producer: (state: T) => T) => void, connect: <S>(Component: React.ComponentType<S>, contexts?: string[], excludedContexts?: string[]) => React.ComponentType<S>;
