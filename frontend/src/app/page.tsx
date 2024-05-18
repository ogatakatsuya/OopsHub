"use client";

import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import React from "react";
import Illustration from "./components/Illustration";
import Hook from "./components/Hook";
import { useAuthContext } from "./auth_provider/AuthProvider";
import SplitScreen from "./components/SplitScreen";
import HomeFooter from "./components/HomeFooter"

export default function LandingPage () {
  const { user } = useAuthContext();
  return (
    <>
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          OopsHub
        </Heading>
        <Text
          as={"span"}
          color={"gray.500"}
          fontSize={{ base: "1xl", md: "3xl" }}
        >
          身近な失敗談をコミュニティに共有して、新たな学びを見つけよう！
        </Text>
        {user ?
        <>
        <Button
            as="a"
            rounded={"full"}
            px={6}
            colorScheme={"black"}
            bg={"black"}
            _hover={{ bg: "gray.700" }}
            href="/app/home"
          >
            Home
          </Button>
        </>:
        <>
        <Stack spacing={6} direction={"row"}>
          <Button
            as="a"
            rounded={"full"}
            px={6}
            colorScheme={"black"}
            bg={"black"}
            _hover={{ bg: "gray.700" }}
            href="/auth/login"
          >
            Login
          </Button>
          <Button
            as="a"
            rounded={"full"}
            px={6}
            _hover={{ bg: "gray.200" }}
            href="/auth/register"
          >
            Sign Up
          </Button>
        </Stack>
        </>}
        <Flex w={"full"}>
          <Illustration
            height={{ sm: "24rem", lg: "28rem" }}
            mt={{ base: 12, sm: 16 }}
          />
        </Flex>
      </Stack>
    </Container>
    <SplitScreen />
    <HomeFooter />
    </>
  );
}
