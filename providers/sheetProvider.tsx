"use client";

import React from "react";
import { NewAccountSheet } from "@/components/accounts/newAccountSheet";
import { useMountedState } from "react-use";

const SheetProvider = () => {
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <NewAccountSheet />
    </>
  );
};

export default SheetProvider;
