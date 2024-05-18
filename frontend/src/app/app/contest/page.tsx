"use client";

import { CardHeader, StackDivider, Card, CardBody, Stack, Link, CardFooter, Button, Heading } from "@chakra-ui/react"
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
                    setContest(data.contests);
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
        <Heading textAlign="center" py={4}>開催中のコンテスト</Heading>
        <Stack>
        {contest.filter(item => item["available"]).map((item) => (
            <Flex justifyContent="center" my={4} key={item["contest_id"]}>
                <Card width="50%">
                    <CardHeader>
                        <Heading size='lg'>{item["name"]}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text size="md">開始 2024/03/10</Text>
                        <Text>締切 2024/05/30</Text>
                    </CardBody>
                    <CardFooter>
                        <Flex justifyContent="flex-end" width="100%">
                            <Button as="a" href={`/app/contest/${item["id"]}`}>参加</Button>
                        </Flex>
                    </CardFooter>
                </Card>
            </Flex>
        ))}
        </Stack>
        <Heading textAlign="center" py={4}>過去のコンテスト</Heading>
        <Stack>
        {contest.filter(item => !item["available"]).map((item) => (
            <Flex justifyContent="center" my={4} key={item["contest_id"]}>
                <Card width="50%">
                    <CardHeader>
                        <Heading size='lg'>{item["name"]}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text size="md">開始 2024/03/10</Text>
                        <Text>締切 2024/05/30</Text>
                    </CardBody>
                    <CardFooter>
                        <Flex justifyContent="flex-end" width="100%">
                            <Button as="a" href={`/app/contest/${item["id"]}`}>参加</Button>
                        </Flex>
                    </CardFooter>
                </Card>
            </Flex>
        ))}
        </Stack>
        <BackButton />
        </>
    )
}

export default Contest;