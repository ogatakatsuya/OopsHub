"use client";

import React from "react";
import { Button, Box } from "@chakra-ui/react";
import AppBar from "./AppBar";
import { useAuthContext } from "@/app/auth_provider/AuthProvider";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Spininng from "../../components/Spininng";
import PostButton from "../home/PostButton";

const Home = () => {
const { user } = useAuthContext();

// useEffect(() => {
//     if (!user) {
//     redirect("/");
//     }
// }, []);

return (
    <Box>
    {user ? (
        <>
          <AppBar />
          <Button
            size="lg"
            colorScheme="green"
            my="24px"
            as="a"
            href="/app/post"
        >
            失敗談を投稿する
          </Button>
          <PostButton />
        </>
    ) : (
        <Spininng />
    )}
    </Box>
);
};

export default Home;
