"use client";

import {
  Box,
  Button,
  Drawer,
  Flex,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { useParams, usePathname } from "next/navigation";
import { MENU_ITEMS } from "./menu-items";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebarMenu({ isOpen, onClose }: MobileSidebarProps) {
  const params = useParams();
  const boardId = params.id as string;
  const path = usePathname();

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="start"
      size="xs"
    >
      <Box display={{ base: "block", lg: "none" }}>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content bg={{ base: "gray.50", _dark: "gray.900" }} h="100vh">
            <Flex direction="column" h="100%" justifyContent="space-between">
              <Box flex="1" overflow="auto">
                <Flex pt="6" align="flex-start" direction="column">
                  <Button
                    asChild
                    variant="ghost"
                    onClick={onClose}
                    _hover={{
                      bg: { base: "gray.100", _dark: "blue.900" },
                    }}
                  >
                    <Flex gap="1" align="flex-start">
                      <IoMenu size={20} />
                      <Text fontWeight="semibold" fontSize="md">
                        Menu
                      </Text>
                    </Flex>
                  </Button>
                </Flex>

                <Separator size="md" mb="4" />

                <Stack gap="2" py="4" px="2">
                  {MENU_ITEMS(path, boardId).map((item) => (
                    <Box key={item.href} onClick={onClose}>
                      <SidebarMenuItem
                        icon={item.icon}
                        label={item.label}
                        href={item.href}
                        isExpanded={true}
                        isCurrent={item.isCurrent}
                      />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Flex>
          </Drawer.Content>
        </Drawer.Positioner>
      </Box>
    </Drawer.Root>
  );
}
