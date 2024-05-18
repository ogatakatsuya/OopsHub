import { useEffect, useState } from "react";
import {
Card,
Flex,
Avatar,
CardHeader,
Heading,
CardBody,
Stack,
StackDivider,
Box,
Text,
} from "@chakra-ui/react";
import { useAuthContext } from "@/app/auth_provider/AuthProvider";
import LikeButton from "./LikeButton";
import DonmaiButton from "./DonmaiButton";
import WaraButton from "./WaraButton";
import { AiOutlineAliwangwang } from "react-icons/ai";

export default function Hook() {
const [value, setValue] = useState([]);
const { user } = useAuthContext();
useEffect(() => {
    const fetchData = async () => {
    try {
        const res = await fetch("http://localhost:8000/post/", {
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
        <Heading size="md">失敗談一覧</Heading>
        </CardHeader>

        <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
            {value.map((item, index) => (
            <Box key={item["id"]}>
                <Flex alignItems={"start"} mb={4}>
                <Avatar />
                <Box ml={2}>
                    <Text bgColor={"gray.200"} rounded={"md"} px={2} py={1}>
                    {item["text"]}
                    </Text>
                </Box>
                </Flex>
                <Flex alignItems={"start"}>
                <Box mr={2}>
                    {item["solution"] ?
                    <Text bgColor={"gray.200"} rounded={"md"} px={2} py={1}>
                    {item["solution"]}
                    </Text> :
                    <Text bgColor={"gray.200"} rounded={"md"} px={2} py={1}>
                    {item["text"]}
                    </Text>
                }
                </Box>
                <AiOutlineAliwangwang />
                </Flex>
                <Text fontSize="sm" my={4}>
                {item["created_at"]}
                </Text>
            </Box>
            ))}
        </Stack>
        </CardBody>
    </Card>
    </>
);
}
