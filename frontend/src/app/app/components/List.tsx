import { useEffect, useState } from "react";
import {
  Divider,
  Flex,
  Avatar,
  Stack,
  StackDivider,
  Box,
  Text,
} from "@chakra-ui/react";
import { useAuthContext } from "@/app/auth_provider/AuthProvider";
import LikeButton from "../../components/LikeButton";
import DonmaiButton from "../../components/DonmaiButton";
import WaraButton from "../../components/WaraButton";

export default function List() {
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
    <Flex bgColor={"gray.200"}>
          <Stack divider={<Divider borderColor='gray.900'/>} spacing="4" >
            {value.map((item, index) => (
              <Box key={item["id"]} mx={6}>
                <Flex alignItems={"start"} mt={4} mb={4}>
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
                  <Avatar />
                </Flex>
                <Text fontSize="sm" my={4}>
                  {item["created_at"]}
                </Text>
                {user && (
                  <>
                    <DonmaiButton
                      post_id={item["id"]}
                      dontminds={item["dontminds"]}
                    />
                    <LikeButton
                      post_id={item["id"]}
                      learneds={item["learneds"]}
                    />
                    <WaraButton post_id={item["id"]} likes={item["likes"]} />
                  </>
                )}
              </Box>
            ))}
          </Stack>
    </Flex>
  );
}
