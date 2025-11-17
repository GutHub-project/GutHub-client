import { QueryProvider } from "@repo/shared";
import { Stack } from "expo-router";
import React from "react";

const AppLayout = () => {
  return (
    <QueryProvider>
      <Stack />
    </QueryProvider>
  );
};

export default AppLayout;
