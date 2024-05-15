'use client';

import {Box,Text} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import ShowIndex from "./components/Index";
import Logout from "./components/Logout";

import { useAuthContext } from "@/auth_provider/AuthProvider";

export default function Home() {
  const { user } = useAuthContext();
  return (
    <>
    <Box maxW='32rem'>
      <Heading mb={4}>失敗談共有アプリ</Heading>
      <Text fontSize='xl'>
        失敗談を共有する事ができるアプリです😃
      </Text>
      <ShowIndex></ShowIndex>
    </Box>
    { user
    ? <>
    <Button size='lg' colorScheme='green' my='24px' as="a" href="/app/post">
      失敗談を投稿する
    </Button>
    <Logout/>
    </>
    : <>
    <Button size='lg' colorScheme='green' my='24px'as="a"href="/auth/register">
    会員登録
    </Button>
    <Button size='lg' colorScheme='green' my='24px'as="a"href="/auth/login"mx="8px">
      ログイン
    </Button>
    </>
    }
    </>
  );
}
