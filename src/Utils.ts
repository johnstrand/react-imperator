import { Action, UniqueIndexer, Func } from "./Types";

export const generateName: Action<string> = (): string =>
    Math.random()
        .toString(36)
        .substring(7);

export const distinct : Func<string[], string[]> = (arr: string[]) => {
    const container: UniqueIndexer =
        arr.reduce((acc: UniqueIndexer, cur: string) => {
            acc[cur] = true;
            return acc;
        }, {});

    return Object.keys(container);
};