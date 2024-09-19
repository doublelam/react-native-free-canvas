import { createContext } from "react";
import { CanvasContextType } from './types';
const CanvasContext = createContext<CanvasContextType>(null);
export default CanvasContext;
