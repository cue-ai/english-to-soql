import { createContext } from "react";

export const ChatContext = createContext({
  append: (arg: any) => {
    console.log("Called append with", arg);
  },
  isLoading: false,
});
