"use client";

import { Box, Text, Flex } from "@chakra-ui/react";

interface ContestProps {
    params: {
        id: number;
    };
}

const Contest = ({ params }: ContestProps) => {
    console.log(params);
    return (
        <>
            <Text>コンテスト{params.id}詳細ページ</Text>
        </>
    );
}

export default Contest;
