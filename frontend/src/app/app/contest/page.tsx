"use client";

import { CardHeader, StackDivider, Card, CardBody, Stack, Link } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";

import { Box, Text, Flex } from "@chakra-ui/react";

const Contest = () => {
    const [contest,setContest] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/contest/", {
                    method: "GET",
                });
                if (res.ok) {
                    const data = await res.json();
                    setContest(data.message);
                } else {
                    console.error("Error fetching tasks:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        console.log(contest); // contestが更新された後にログに出力
    }, [contest]);
    return (
        <>
        <Card my={4}>
            <CardHeader>開催中のコンテスト</CardHeader>
            <CardBody>
                <Stack divider={<StackDivider/>} spacing='4'>
                {contest.map((item) => (
                    <Box key={item["id"]}>
                        <Flex>
                            <Link rounded={'md'} px={2} py={1} href={`/app/contest/${item["id"]}`}>
                                {item["name"]}
                            </Link>
                        </Flex>
                    </Box>
                ))}
                </Stack>
            </CardBody>
        </Card>
        <BackButton />
        </>
    )
}

export default Contest;