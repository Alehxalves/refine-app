"use client";

import { useColorMode } from "@/components/ui/color-mode";
import { Box, ClientOnly, Flex, Switch, Text } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

type SwitchThemeButtonProps = {
  isExpanded: boolean;
};

export function SwitchThemeButton({ isExpanded }: SwitchThemeButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <ClientOnly>
      <Flex
        alignItems="center"
        gap={isExpanded ? "2" : "0"}
        justifyContent={isExpanded ? "flex-start" : "center"}
        transition="all 0.3s ease-in-out"
        w="100%"
        px="3"
      >
        <Switch.Root 
          checked={isDark}
          onCheckedChange={toggleColorMode}
          colorPalette="blue"
          size="md"
          flexShrink="0"
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb>
              {isDark ? <FiMoon size={12} color="#2C3849" /> : <FiSun size={12} />}
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Root>

        <Box
          overflow="hidden"
          maxW={isExpanded ? "200px" : "0"}
          opacity={isExpanded ? 1 : 0}
          transition="all 0.3s ease-in-out"
        >
          <Text
            fontSize="xs"
            fontWeight="medium"
            whiteSpace="nowrap"
            color={{ base: "gray.900", _dark: "gray.50" }}
          >
            {isDark ? "Modo Escuro" : "Modo Claro"}
          </Text>
        </Box>
      </Flex>
    </ClientOnly>
  );
}