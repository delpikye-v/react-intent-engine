import { Intent, IntentHandler, Guard, Middleware } from "./types";
export declare function createIntentEngine<TState extends object>(opts: {
    initialState: TState;
    effects?: any;
    middleware?: Middleware[];
}): {
    emit: (intent: Intent) => Promise<void>;
    on: (type: string, handler: IntentHandler) => void;
    guard: (type: string, g: Guard) => void;
    store: {
        getState: () => TState;
        setState: (updater: (prev: TState) => TState) => void;
        subscribe: (listener: () => void) => () => boolean;
    };
    getStatus: (type: string) => string;
};
