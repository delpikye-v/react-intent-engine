export type Intent<T = any> = {
    type: string;
    payload?: T;
};
export type IntentStatus = "idle" | "pending" | "success" | "error";
export type IntentHandler<T extends Intent = Intent> = (intent: T, ctx: IntentContext) => Promise<void> | void;
export type Guard = (ctx: IntentContext) => boolean;
export type Middleware = (intent: Intent, next: () => Promise<void>) => Promise<void>;
export type EffectMap = Record<string, any>;
export type IntentContext = {
    get<T = any>(path: string): T;
    set(path: string, value: any): void;
    emit(intent: Intent): Promise<void>;
    effects: EffectMap;
};
