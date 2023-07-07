import Image from "next/image";
import { Login } from "@/components/organisms/Login";
import { Chat } from "@/components/organisms/Chat/Chat";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24  pt-24 ">
      <div className="z-10 w-full h-full flex-grow items-center justify-between lg:flex pt-24">
        {/*<Login />*/}
        <Chat />
      </div>
    </div>
  );
}
