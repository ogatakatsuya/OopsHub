"use client";

import React from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";

export default function Spininng() {
  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(255, 255, 255, 0.8)" // 背景を半透明にする
        zIndex="1000" // スピナーを最前面に表示
      >
        <Spinner size="xl" mr={5} />
        <Text fontSize={"20px"}>Loading...</Text>
      </Box>
    </>
  );
}
