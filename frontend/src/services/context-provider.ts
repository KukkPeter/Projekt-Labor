import { createContext } from "solid-js";
import { DependencyContainer } from "tsyringe";

export const DIContextProvider = createContext<DependencyContainer>();