'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import {Box,Text} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const [message, setMessage] = useState("");
  useEffect(()=>{
      fetch("http://localhost:8000/", {method: "GET"})
      .then(res=>res.json())
      .then(data => {setMessage(data.message)});
  }, [])
  return (
    <>
    <Heading>{message}</Heading>
    <Box maxW='32rem'>
      <Heading mb={4}>失敗談共有アプリ</Heading>
      <Text fontSize='xl'>
        失敗談を共有する事ができるアプリです😃
      </Text>
      <Button 
      size='lg' 
      colorScheme='green' 
      mt='24px'
      as="a"
      href="/Post">
        失敗談を投稿する
      </Button>
    </Box>
    <Button 
      size='lg' 
      colorScheme='green' 
      mt='24px'
      as="a"
      href="/Register">
        会員登録
      </Button>
      <Button 
      size='lg' 
      colorScheme='green' 
      mt='24px'
      as="a"
      href="/Login"
      mx="8px">
        ログイン
      </Button>
    </>
  );
}
