"use client";

import { Box, Text, Flex, Card, CardHeader, Stack, StackDivider, CardBody, Heading, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react";
import SubmitMordal from "../components/SubmitMordal";

import SubimitButton from "../components/SubimitButton";

interface ContestProps {
    params: {
        id: number;
    };
}

const Contest = ({ params }: ContestProps) => {
    const [value, setValue] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/contest/${params.id}/post`, {
                    method: "GET",
                });
                if (res.ok) {
                    const data = await res.json();
                    setValue(data.message);
                    console.log("Fetched data:", data);
                    // 取得したデータを処理する
                } else {
                    console.error("Error fetching tasks:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <>
        <Card>
        <CardHeader>
            <Heading size='md'>コンテスト{params.id} 詳細ページ</Heading>
        </CardHeader>

        <CardBody>
            <Stack divider={<StackDivider />} spacing='4'>
            {value.map((item, index) => (
                <Box key={item["id"]}>
                    <Flex alignItems={'start'} mb={4}>
                    <Box ml={2}>
                        <Text rounded={'md'} px={2} py={1}>
                        {item["message"]}
                        </Text>
                    </Box>
                    </Flex>
                </Box>
            ))}
            </Stack>
        </CardBody>
        </Card>

        <Button onClick={onOpen}
                size="lg"
                colorScheme="green"
                my="24px"
                mx="24px">
            コンテストに投稿する
        </Button>
        <SubmitMordal isOpen={isOpen} onClose={onClose} onOpen={onOpen} contest_id={params.id}/>
        </>
    );
}

export default Contest;
