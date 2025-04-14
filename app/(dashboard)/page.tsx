"use client";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/hooks/accounts/use-new-account";
import React from "react";

const Home = () => {
  const { onOpen } = useNewAccount();
  return (
    <div>
      <Button onClick={onOpen}>Add an account</Button>
    </div>
  );
};

export default Home;
