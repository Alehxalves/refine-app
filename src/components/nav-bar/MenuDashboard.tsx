import { Avatar, Flex, Menu, Portal } from "@chakra-ui/react";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { useColorMode } from "../ui/color-mode";
import { CircleSmall } from "lucide-react";
import { useTheme } from "next-themes";

export default function MenuDashboard() {
  const { user } = useUser();

  const { setTheme } = useTheme();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const handleMenuThemeChange = (theme: "light" | "dark") => {
    setTheme(theme);
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Flex
          cursor={"pointer"}
          gap={2}
          alignItems="center"
          transition="all 0.3s ease-in-out"
        >
          <Avatar.Root alignItems="center" flexShrink="0">
            {user?.hasImage ? (
              <Avatar.Image src={user.imageUrl} alt={user.username ?? ""} />
            ) : (
              <Avatar.Fallback name={user?.username ?? ""} />
            )}
          </Avatar.Root>
        </Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Styles</Menu.ItemGroupLabel>
              <Menu.Item value="bold">Bold</Menu.Item>
              <Menu.Item value="underline">Underline</Menu.Item>
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Tema</Menu.ItemGroupLabel>
              <Menu.Item
                value="light"
                onClick={() => handleMenuThemeChange("light")}
              >
                <CircleSmall
                  size="16"
                  color="#3F3F46"
                  fill="#3F3F46"
                  style={{ opacity: isDark ? 0 : 1 }}
                />
                Claro
              </Menu.Item>
              <Menu.Item
                value="dark"
                onClick={() => handleMenuThemeChange("dark")}
              >
                <CircleSmall
                  size="16"
                  color="#FAFAFA"
                  fill="#FAFAFA"
                  style={{ opacity: isDark ? 1 : 0 }}
                />
                Escuro
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.Item value="logout">Sair</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
