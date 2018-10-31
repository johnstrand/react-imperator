export type Action<T> = () => T;
export type VoidAction<T> = (arg: T) => void;
export type VoidAction2<T1, T2> = (arg1: T1, arg2: T2) => void;
export type Func<TArg, TReturn> = (arg: TArg) => TReturn;
export type Func2<TArg1, TArg2, TReturn> = (arg1: TArg1, arg2: TArg2) => TReturn;

export type Callback = VoidAction<any>;
export interface SubscriberCallback { [key: string]: Callback; }
export interface ContextCallback { [key: string]: SubscriberCallback; }
export type CallbackRegistration = (context: string, consumer: string, callback: Callback) => void;

export interface UniqueIndexer { [key: string]: boolean; }
export interface IndexedObject { [key: string]: any; }