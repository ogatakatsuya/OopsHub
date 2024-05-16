import React from "react";
import { Button } from "@chakra-ui/react";
import Logout from "./Logout";
import Navi from "./Navi";

export default function MyPages() {
  <>
    <Button size="lg" colorScheme="green" my="24px" as="a" href="/app/post">
      失敗談を投稿する
    </Button>
    <Logout />
    <Navi />
  </>;
}
