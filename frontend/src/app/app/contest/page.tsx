"use client";

import { CardHeader, StackDivider, Card, CardBody, Stack, Link, CardFooter, Button, Heading } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import BackButton from "@/app/components/BackButton";
import MypageLayout from "../layout";

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
        <MypageLayout>
        <Stack divider={<StackDivider/>} spacing='4'>
        {contest.map((item) => (
            <Card key={item["id"]}>
            <CardHeader>
                <Heading size='md'>{item["name"]}</Heading>
            </CardHeader>
            <CardBody>
                <Text>開始 2024/03/10</Text>
                <Text>締切 2024/05/30</Text>
            </CardBody>
            <CardFooter>
                <Button as="a" href={`/app/contest/${item["id"]}`}>参加</Button>
            </CardFooter>
            </Card>
        ))}
        </Stack>
        <BackButton />
        </MypageLayout>
    )
}

export default Contest;