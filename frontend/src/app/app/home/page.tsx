"use client";

import React from "react";
import { Button, Box } from "@chakra-ui/react";
import PostButton from "../components/PostButton";
import List from "../components/List";

const Home = () => {
  return (
    <Box>
      <List />
      <PostButton />
    </Box>
  );
};

export default Home;
