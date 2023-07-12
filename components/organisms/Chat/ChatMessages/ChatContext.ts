import { createContext } from "react";
import { Message } from "ai";

export const ChatContext = createContext({
  append: (arg: Message) => {
    console.log("Called append with", arg);
  },
  isLoading: false,
  messages: [{} as Message],
});
