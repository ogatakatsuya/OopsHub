"use client";

import React from "react";
import { Button, Box } from "@chakra-ui/react";
import PostButton from "../PostButton";

const Home = () => {
  return (
    <Box>
      <Button size="lg" colorScheme="green" my="24px" as="a" href="/app/post">
        失敗談を投稿する
      </Button>
      <PostButton />
    </Box>
  );
};

export default Home;
