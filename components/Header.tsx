import React from "react";
import HeaderLogo from "./header-logo";
import Navigation from "./Navigation";
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Welcome from "./welcome";
import { Filters } from "./filters";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-600 to-purple-600 px-4 py-8 lg:px-14 pb-32">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </ClerkLoading>
        </div>
        <Welcome />
        <Filters />
      </div>
    </header>
  );
};

export default Header;
