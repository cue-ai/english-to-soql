import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { FiGithub } from "react-icons/fi";

export const Header = async () => (
  <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 ">
    <div className="flex items-center justify-end space-x-2">
      <a
        target="_blank"
        href="https://github.com/cue-ai/english-to-soql"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline" }))}
      >
        <FiGithub />
        <span className="hidden ml-2 md:flex">GitHub</span>
      </a>
    </div>
  </header>
);
