"use client";

import { NavBar } from "@/components/nav-bar";
import { Box, Container } from "@chakra-ui/react";
import Lottie from "lottie-react";
import React from "react";
import ladingAnimation from "@/assets/lottie/loading1.json";

export default function RootPage() {
  return (
    <>
      <NavBar />
      <Container px="4" py="6" textAlign="center">
        <Box mt="10" width={32} height={32} justifySelf="center">
          <Lottie animationData={ladingAnimation} loop={true} />
        </Box>
      </Container>
    </>
  );
}
