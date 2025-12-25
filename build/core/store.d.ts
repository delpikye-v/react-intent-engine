type Listener = () => void;
export declare function createStore<T>(initial: T): {
    getState: () => T;
    setState: (updater: (prev: T) => T) => void;
    subscribe: (listener: Listener) => () => boolean;
};
export {};
