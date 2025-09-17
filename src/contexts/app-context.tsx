"use client";

import type { PortfolioBlockId } from "@/lib/types";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";

const LOCAL_STORAGE_KEY = "kaushal-waray-portfolio-state";
const MINING_REWARD = 0.10; // Fixed reward for mining a block

// State
interface AppState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  walletAddress: string;
  walletBalance: number;
  mintedBlocks: PortfolioBlockId[];
  gasPrice: number;
  hasCompletedOnboarding: boolean;
  isAssistantOpen: boolean;
  isMinting: boolean;
}

const initialState: AppState = {
  isInitialized: false,
  isAuthenticated: false,
  walletAddress: "",
  walletBalance: 0,
  mintedBlocks: [],
  gasPrice: 0,
  hasCompletedOnboarding: false,
  isAssistantOpen: false,
  isMinting: false,
};

// Actions
type Action =
  | { type: "LOAD_STATE"; payload: Partial<AppState> }
  | { type: "CONNECT_WALLET"; payload: { walletAddress: string; balance: number } }
  | { type: "DISCONNECT_WALLET" }
  | { type: "CLAIM_FAUCET"; payload: { amount: number } }
  | { type: "MINT_BLOCK"; payload: { blockId: PortfolioBlockId; cost: number } }
  | { type: "SET_GAS_PRICE"; payload: number }
  | { type: "COMPLETE_ONBOARDING" }
  | { type: "TOGGLE_ASSISTANT" }
  | { type: "SET_MINTING_STATE"; payload: boolean };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_STATE":
      return { ...state, ...action.payload, isInitialized: true };
    case "CONNECT_WALLET":
      return {
        ...state,
        isAuthenticated: true,
        walletAddress: action.payload.walletAddress,
        walletBalance: action.payload.balance,
      };
    case "DISCONNECT_WALLET":
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      // Reset all state to initial values for a clean session.
      return { 
        ...initialState, 
        isInitialized: true,
        isAuthenticated: false
      };
    case "CLAIM_FAUCET":
      return {
        ...state,
        walletBalance: state.walletBalance + action.payload.amount,
      };
    case "MINT_BLOCK":
      if (state.mintedBlocks.includes(action.payload.blockId)) {
        return state;
      }
      return {
        ...state,
        walletBalance: state.walletBalance - action.payload.cost + MINING_REWARD,
        mintedBlocks: [...state.mintedBlocks, action.payload.blockId],
      };
    case "SET_GAS_PRICE":
      return { ...state, gasPrice: action.payload };
    case "COMPLETE_ONBOARDING":
      return { ...state, hasCompletedOnboarding: true };
    case "TOGGLE_ASSISTANT":
      return { ...state, isAssistantOpen: !state.isAssistantOpen };
    case "SET_MINTING_STATE":
        return { ...state, isMinting: action.payload };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<Action>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // On initial load, don't auto-authenticate. Only load onboarding status.
        // Authentication happens via user action (connecting wallet).
        dispatch({ type: "LOAD_STATE", payload: { hasCompletedOnboarding: parsedState.hasCompletedOnboarding } });
      } else {
        dispatch({ type: "LOAD_STATE", payload: {} }); // Mark as initialized
      }
    } catch (error) {
      console.error("Failed to load state from localStorage:", error);
      dispatch({ type: "LOAD_STATE", payload: {} }); // Mark as initialized
    }
  }, []);

  useEffect(() => {
    // Only save state to localStorage if the user is authenticated.
    if (state.isInitialized && state.isAuthenticated) {
      try {
        const stateToSave = {
          isAuthenticated: state.isAuthenticated,
          walletAddress: state.walletAddress,
          walletBalance: state.walletBalance,
          mintedBlocks: state.mintedBlocks,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error("Failed to save state to localStorage:", error);
      }
    }
  }, [state]);


  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
