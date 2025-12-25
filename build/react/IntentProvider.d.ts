import React, { ReactNode } from "react";
type EngineContextType = any;
export declare function IntentProvider({ engine, children, }: {
    engine: EngineContextType;
    children: ReactNode;
}): React.JSX.Element;
export declare function useEngine(): any;
export {};
