"use client";

import { usePathname, useRouter } from "next/navigation";
import NavButton from "./nav-button";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { useMedia } from "react-use";
import React from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const routes = [
  { name: "Overview", href: "/" },
  { name: "Transactions", href: "/transactions" },
  { name: "Accounts", href: "/accounts" },
  { name: "Categories", href: "/categories" },
  { name: "Settings", href: "/settings" },
];

const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();

  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white transition focus:bg-white/30"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <VisuallyHidden>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden>

          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                variant={route.href === pathname ? "secondary" : "ghost"}
                key={route.href}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                {route.name}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.name}
          active={pathname === route.href}
        ></NavButton>
      ))}
    </nav>
  );
};

export default Navigation;
