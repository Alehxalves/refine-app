"use client";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import notFoundAnimation from "@/assets/lottie/empty-face.json";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="70vh"
      px={4}
    >
      <VStack gap={4} textAlign="center">
        <Box w="200px" opacity={0.9}>
          <Lottie animationData={notFoundAnimation} loop />
        </Box>

        <Heading fontSize="2xl" mt={2}>
          Página não encontrada
        </Heading>

        <Text fontSize="sm" color="gray.500" maxW="320px">
          Opa! Parece que esse conteúdo não existe ou foi movido. Verifique o
          endereço ou volte para continuar navegando.
        </Text>

        <Button
          size="sm"
          colorScheme="purple"
          borderRadius="full"
          onClick={() => router.push("/")}
        >
          Voltar para o início
        </Button>
      </VStack>
    </Box>
  );
}
