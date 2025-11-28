"use client";

import navIcon from "@/assets/navIcon.png";
import {
  Box,
  Button,
  Flex,
  HStack,
  List,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Stack,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Menu,
  MoveRight,
  SquareKanban,
  SquarePen,
  SunMoonIcon,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useColorMode } from "../ui/color-mode";
import { LuCircleCheck, LuCircleDashed } from "react-icons/lu";
import { MobileSidebarMenu } from "../dashboard/menu/MobileSidebarMenu";

interface NavBarProps {
  boardTitle?: string;
  boardColor?: string;
  onEditBoard?: () => void;
}

export function NavBar({ boardTitle, boardColor, onEditBoard }: NavBarProps) {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const { setTheme } = useTheme();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const handleMenuThemeChange = (theme: "light" | "dark") => {
    setTheme(theme);
  };

  const [isMobile] = useMediaQuery(["(max-width: 1024px)"]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/dashboard/board/");

  const handleGoToDashboard = () => {
    setIsNavigating(true);
    router.push("/dashboard");
  };

  function handleMenuClick() {
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(true);
    }
  }

  const userButtonAppearance = {
    elements: {
      userButtonAvatarBox: "w-40 h-40",
      userButtonPopoverCard: "bg-blue-100",
      userButtonPopoverActionButton: "text-red-600",
    },
  };

  if (isBoardPage) {
  }

  return (
    <Box
      px="6"
      py="2"
      bg={{ base: "gray.50", _dark: "gray.900" }}
      borderBottomWidth="1px"
      borderColor={{ base: "gray.300", _dark: "gray.700" }}
    >
      <Flex justifyContent="space-between" alignItems="center">
        {!isBoardPage && (
          <HStack>
            <Box
              cursor="pointer"
              onClick={() => router.push("/")}
              borderWidth="1px"
              borderRadius="lg"
              mr="2"
            >
              <Image width={32} height={32} alt="Logo" src={navIcon} />
            </Box>
            <Text fontWeight="bold">Refine</Text>
          </HStack>
        )}
        {!isLoaded ? (
          <Stack maxW="xs">
            <SkeletonCircle size="10" />
            <Skeleton />
          </Stack>
        ) : isSignedIn ? (
          isDashboardPage || isBoardPage ? (
            <>
              {isBoardPage && (
                <HStack alignItems="center">
                  {isMobile && (
                    <>
                      <Button
                        alignSelf="left"
                        asChild
                        variant="ghost"
                        onClick={handleMenuClick}
                        _hover={{
                          bg: { base: "gray.100", _dark: "blue.900" },
                        }}
                      >
                        <Flex alignItems="center" gap="1">
                          <Menu size={18} />
                          <Text
                            fontWeight="semibold"
                            fontSize="md"
                            display={{ base: "none", lg: "block" }}
                          >
                            Menu
                          </Text>
                        </Flex>
                      </Button>
                      <MobileSidebarMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                      />
                    </>
                  )}

                  <HStack alignItems="flex-end">
                    <SquareKanban size={18} color={boardColor ?? "#3B82F6"} />

                    {boardTitle ? (
                      <Text fontSize="sm" fontWeight="medium">
                        {boardTitle}
                      </Text>
                    ) : (
                      <Skeleton height="4" width="150px" />
                    )}

                    {boardTitle && (
                      <SquarePen
                        cursor="pointer"
                        onClick={onEditBoard}
                        size={18}
                      />
                    )}
                  </HStack>
                </HStack>
              )}
              <UserButton appearance={userButtonAppearance}>
                <UserButton.UserProfilePage
                  label="Tema"
                  labelIcon={<SunMoonIcon size="20px" />}
                  url="theme"
                >
                  <List.Root gap="2" variant="plain" align="center">
                    <List.Item
                      cursor="pointer"
                      onClick={() => handleMenuThemeChange("light")}
                    >
                      <List.Indicator
                        asChild
                        color={!isDark ? "green.500" : "gray.500"}
                      >
                        {!isDark ? <LuCircleCheck /> : <LuCircleDashed />}
                      </List.Indicator>
                      Padrão
                    </List.Item>
                    <List.Item
                      cursor="pointer"
                      onClick={() => handleMenuThemeChange("dark")}
                    >
                      <List.Indicator
                        asChild
                        color={isDark ? "green.500" : "gray.500"}
                      >
                        {isDark ? <LuCircleCheck /> : <LuCircleDashed />}
                      </List.Indicator>
                      Escuro
                    </List.Item>
                  </List.Root>
                </UserButton.UserProfilePage>
              </UserButton>
            </>
          ) : (
            <VStack>
              <HStack>
                <Text fontSize="xs" display={{ base: "none", md: "block" }}>
                  Boas vindas,{" "}
                  {user?.firstName ?? user.emailAddresses[0].emailAddress}
                  {". "}
                  <Link href="/profile">Sair</Link>
                </Text>
              </HStack>
              <Button size="xs" fontSize="xs" onClick={handleGoToDashboard}>
                Acessar Dashboard
                {isNavigating ? <Spinner size="xs" /> : <MoveRight />}
              </Button>
            </VStack>
          )
        ) : (
          <HStack>
            <SignInButton>
              <Button variant="ghost" size="sm" fontSize={"sm"}>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" fontSize={"sm"}>
                Sign Up
              </Button>
            </SignUpButton>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
