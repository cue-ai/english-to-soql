"use client";
import React, { useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTokenExchange = async (code: string) => {
    try {
      const res = await fetch("/api/oauth2", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.salesforceId && data.refreshToken) {
        localStorage.setItem("salesforceInfo",JSON.stringify(data))}
      router.push("/");
    } catch (err) {
      router.push("/");
      console.log(err);
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleTokenExchange(code);
    } else {
      router.push("/");
    }
  }, [searchParams]);

  return (
    <div className={"pt-24 text-center"}>
      <h1 className="animate-pulse text-md font-semibold  bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20">
        Authenticating ...
      </h1>
    </div>
  );
}
