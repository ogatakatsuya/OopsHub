'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import React, { ChangeEvent } from "react";
import {Box,Text} from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react"

export default function Home() {

let [title, setTitle] = useState("");
let [text, setText] = useState("");

let handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    setText(inputValue);
}

let handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
}
return (
    <>
    <Box maxW='32rem'>
    <Heading mb={4}>失敗談共有アプリ</Heading>
    <Text fontSize='xl'>
        失敗談を共有する事ができるアプリです😃
    </Text>
    <Text mt="30px" fontSize="l">ログイン</Text>
    <Text my="8px">ニックネーム：{title}</Text>
    <Input
    onChange={handleTitleChange}/>
    <Text my="8px">パスワード：{title}</Text>
    <Input
    type="password"
    onChange={handleTitleChange}/>
    <Button 
    size='lg' 
    colorScheme='green' 
    mt='24px'
    as="a"
    href="">
        ログイン
    </Button>
    </Box>
    </>
);
}
