import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { FiGithub } from "react-icons/fi";

export const Header = async () => (
  <header className="sticky top-0 z-50 flex items-center justify-between w-full h-14 px-24 shrink-0 ">
    <div className="flex items-center justify-start space-x-2 w-full h-full border-b font-bold text-white mt-10">
      <img src="/salesforceLogo.svg" alt="Logo" />
      <h1>AskSalesforce</h1>
    </div>
  </header>
);
