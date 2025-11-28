"use client";

import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { system } from "@/theme";

export function Provider({
  children,
  ...props
}: React.PropsWithChildren<ColorModeProviderProps>) {
  return (
    <ColorModeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={true}
      {...props}
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ColorModeProvider>
  );
}
