"use client";

import React from "react";
import { useAuthContext } from "@/auth_provider/AuthProvider";
import Introduction from "./components/intro";
import { Button } from "@chakra-ui/react";
import Logout from "./components/Logout";
import Navi from "./components/Navi";

export default function Home() {
  const { user } = useAuthContext();
  return (
    <>
      {user ? (
        <>
          <Button
            size="lg"
            colorScheme="green"
            my="24px"
            as="a"
            href="/app/post"
          >
            失敗談を投稿する
          </Button>
          <Logout />
          <Navi />
        </>
      ) : (
        <Introduction />
      )}
    </>
  );
}
