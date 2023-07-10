"use client";
import Image from "next/image";
import { Login } from "@/components/organisms/Login";
import { Chat } from "@/components/organisms/Chat/Chat";
import { useState } from "react";

export default function Home() {
  const [vesselId, setVesselId] = useState("");
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-24  ">
      <div
        className={`z-10 w-full h-full min-h-screen flex-grow items-center justify-between lg:flex ${
          !vesselId && "pt-24"
        } `}
      >
        {!vesselId ? (
          <Login setVesselId={setVesselId} />
        ) : (
          <Chat vesselId={vesselId} setVesselId={setVesselId} />
        )}
      </div>
    </div>
  );
}
