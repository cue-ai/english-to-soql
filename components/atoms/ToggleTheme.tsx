"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/Button";
import { FC } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export const ThemeToggle: FC = () => {
  const { setTheme, theme } = useTheme();
  const [_, startTransition] = React.useTransition();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === "light" ? "dark" : "light");
        });
      }}
    >
      {!theme ? null : theme === "dark" ? (
        <FiMoon className="transition-all" />
      ) : (
        <FiSun className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
