import { QueryProvider } from "@repo/shared";
import { Stack } from "expo-router";

const AppLayout = () => {
  return (
    <QueryProvider>
      <Stack />
    </QueryProvider>
  );
};

export default AppLayout;
