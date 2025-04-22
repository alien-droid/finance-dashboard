"use client";

import React from "react";
import { NewAccountSheet } from "@/components/accounts/newAccountSheet";
import { useMountedState } from "react-use";
import { EditAccountSheet } from "@/components/accounts/editAccountSheet";

import { NewCategorySheet } from "@/components/categories/newCategorySheet";
import { EditCategorySheet } from "@/components/categories/editCategorySheet";

const SheetProvider = () => {
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
    </>
  );
};

export default SheetProvider;
