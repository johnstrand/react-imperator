export type Action<T> = () => T;
export type VoidAction<T> = (arg: T) => void;
export type VoidAction2<T1, T2> = (arg1: T1, arg2: T2) => void;
export type Func<TArg, TReturn> = (arg: TArg) => TReturn;

export type Callback = VoidAction<any>;
export type SubscriberCallback = { [key: string]: Callback };
export type ContextCallback = { [key: string]: SubscriberCallback };
export type CallbackRegistration = (context: string, consumer: string, callback: Callback) => void;

export type UniqueIndexer = { [key: string]: boolean };
export type IndexedObject = { [key: string]: any };