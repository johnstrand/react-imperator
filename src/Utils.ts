import { Action, UniqueIndexer, Func, Func2 } from "./Types";

export const generateName: Action<string> = (): string =>
    Math.random()
        .toString(36)
        .substring(7);

export const distinct: Func<string[], string[]> = (arr: string[]) => {
    const lookup: UniqueIndexer =
        arr.reduce((acc: UniqueIndexer, cur: string) => {
            acc[cur] = true;
            return acc;
        }, {});

    return Object.keys(lookup);
};

export const exclude: Func2<string[], string[], string[]> = (sourceArray: string[], excludeArray: string[]) => {
    const excludeLookup: UniqueIndexer =
        excludeArray.reduce((acc: UniqueIndexer, cur: string) => {
            acc[cur] = true;
            return acc;
        }, {});

    return sourceArray.filter(item => !excludeLookup[item]);
};