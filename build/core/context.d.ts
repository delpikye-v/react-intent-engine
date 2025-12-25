import { Intent, IntentContext } from "./types";
export declare function createContext(store: any, emit: (intent: Intent) => Promise<void>, effects: any): IntentContext;
