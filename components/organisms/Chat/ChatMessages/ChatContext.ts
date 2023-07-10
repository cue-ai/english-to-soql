import { createContext } from "react";

export const ChatContext = createContext({
  append: (arg: any) => {},
  isLoading: false,
});
