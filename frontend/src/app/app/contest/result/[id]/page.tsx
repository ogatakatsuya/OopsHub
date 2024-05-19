"use client";

import { Box, Text, Flex, Card, CardHeader, Stack, StackDivider, CardBody, Heading, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react"
import { useDisclosure } from "@chakra-ui/react";
import SubmitMordal from "../../components/SubmitMordal";
import VoteButton from "../../components/VoteButton";
import PostButton from "../../components/PostButton";



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
        <Card>
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
            <Stack divider={<StackDivider />} spacing='4'>
            {value.map((item, index) => (
                <Box key={item["id"]}>
                    <Flex alignItems={'start'} mb={4}>
                    <Box ml={2}>
                        <Text rounded={'md'} px={2} py={1}>
                        {item["message"]}
                        </Text>
                        <Text fontSize="sm" my={4}>
                        {item["created_at"]}
                        </Text>
                    </Box>
                    </Flex>
                </Box>
            ))}
            </Stack>
        </CardBody>
        </Card>

        <PostButton contest_id={params.id} />
        <SubmitMordal isOpen={isOpen} onClose={onClose} onOpen={onOpen} contest_id={params.id} setValue={setValue}/>
        </>
    );
}

export default Contest;
