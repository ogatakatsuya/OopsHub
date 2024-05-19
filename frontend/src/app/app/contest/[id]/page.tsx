"use client";

import { Box, Text, Flex, Card, CardHeader, Stack, StackDivider, CardBody, Heading, Button, Avatar } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react";
import SubmitMordal from "../components/SubmitMordal";
import VoteButton from "../components/VoteButton";
import PostButton from "../components/PostButton";



interface ContestProps {
    params: {
        id: number;
    };
}

const Contest = ({ params }: ContestProps) => {
    const [value, setValue] = useState([]);
    const [title, setTitle] = useState("");
    const [created_at, setCreated_at] = useState("");
    const [deadline,setDeadline] = useState("");
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
                    setTitle(data.title);
                    setCreated_at(data.created_at);
                    setDeadline(data.deadline);
                } else {
                    console.error("Error fetching tasks:", res.statusText);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchData();
    }, []);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };
    return (
        <>
        <Flex justifyContent="center" mt={4}>
        <Card width={['80%', '70%', '60%', '50%']}>
        <CardHeader
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        >
        <Heading size="md" mb={6}>お題 : {title}</Heading>
        <Text>開始 : {created_at}</Text>
        <Text>締切 : {formatDate(deadline)}</Text>
        </CardHeader>
        <CardBody>
            {value.map((item, index) => (
            <Box key={item["id"]} mx="auto" mt={5} width={['100%', '90%', '80%', '70%']} justifyContent="center">
                <Stack direction="row">
                <Avatar boxSize={10} />
                <Flex flex={1} direction="column" alignItems={'start'}>
                    <Stack direction={'row'} alignItems={'center'}>
                    <Text fontSize={14} fontWeight={'bold'}>
                        ユーザー名
                    </Text>
                    <Text fontSize={12}>{item['created_at']}</Text>
                    </Stack>
                    <Box>
                    <Text fontSize={14} px={2} py={1}>
                        {item['message']}
                    </Text>
                    </Box>
                </Flex>
                </Stack>
                <Flex justifyContent="flex-end" mt={2}>
                <VoteButton votes={item["votes"]} post_id={item["id"]}/>
                </Flex>
            </Box>
            ))}
        </CardBody>
        </Card>
        </Flex>

        <PostButton contest_id={params.id} />
        <SubmitMordal isOpen={isOpen} onClose={onClose} onOpen={onOpen} contest_id={params.id} setValue={setValue}/>
        </>
    );
}

export default Contest;
