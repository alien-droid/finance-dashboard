import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";


type Props = {
  label: string;
  href: string;
  active?: boolean;
};

const NavButton = ({ href, label, active }: Props) => {
  return (
    <Button
      variant="outline"
      asChild
      size="sm"
      className={cn(
        "w-full lg:w-auto justify-between font-normal hover:bg-white/20 border-none hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white transition focus:bg-white/30",
        active ? "bg-white/10 text-white" : "bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
