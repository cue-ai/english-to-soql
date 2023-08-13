import { createContext } from "react";
import { Message } from "ai";

export type ChatContextType={
  append:(arg:Message)=>void,
  isLoading:boolean,
  messages:Message[]
}

const defaultValue: ChatContextType = {
  append: () => {},
  isLoading: false,
  messages: [],
};

export const ChatContext = createContext<ChatContextType>(defaultValue);
