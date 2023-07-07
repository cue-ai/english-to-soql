import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { WelcomeBox } from "./WelcomeBox";

export const Chat = () => {
  return (
    <div className={"flex flex-col items-center  w-full h-full items-center "}>
      <WelcomeBox />
      {/*input box*/}
      <div className=" flex flex-col items-center justify-center w-full absolute bottom-14 ">
        <div
          className={"items-center flex mx-auto w-7/12 max-w-2xl  space-x-2"}
        >
          <Input
            placeholder="Send a question"
            className={
              "focus:outline-none  bg-gray-800 border-gray-800 text-white f"
            }
          />
          <Button type="submit" className={"bg-blue-900 "} size={"sm"}>
            Ask
          </Button>
        </div>
        <p className={"mt-4 text-sm text-white text-slate-600"}>
          See previous questions
        </p>
      </div>
    </div>
  );
};
