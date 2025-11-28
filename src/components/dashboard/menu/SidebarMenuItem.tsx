"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

interface SidebarMenuItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isExpanded: boolean;
  color?: string;
  isCurrent: boolean;
}

export function SidebarMenuItem({
  icon: Icon,
  label,
  href,
  isExpanded,
  color = "#3B82F6",
  isCurrent,
}: SidebarMenuItemProps) {
  return (
    <Link
      href={{
        pathname: href,
      }}
    >
      <Flex
        alignItems="center"
        gap={isExpanded ? "2" : "0"}
        py="2"
        px="3"
        borderRadius="md"
        bg={
          isCurrent ? { base: "gray.200/60", _dark: "blue.900" } : "transparent"
        }
        justifyContent={isExpanded ? "flex-start" : "center"}
        _hover={{
          bg: { base: "gray.200/60", _dark: "blue.900" },
        }}
        transition="all 0.2s"
        overflow="hidden"
        title={label}
      >
        <Box flexShrink="0" display="flex" alignItems="center">
          <Icon size="20" color={color} />
        </Box>
        <Box
          overflow="hidden"
          maxW={isExpanded ? "200px" : "0"}
          opacity={isExpanded ? 1 : 0}
          transition="all 0.3s ease-in-out"
        >
          <Text fontSize="sm" fontWeight="semibold" whiteSpace="nowrap">
            {label}
          </Text>
        </Box>
      </Flex>
    </Link>
  );
}
