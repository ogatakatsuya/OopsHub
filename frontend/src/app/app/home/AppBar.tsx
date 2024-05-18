"use client";

import React from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";
import { SettingsIcon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";
import {
  BsFillHouseDoorFill,
  BsLightbulbFill,
  BsBellFill,
} from "react-icons/bs";

interface Props {
  children: React.ReactNode;
}

const Links = ["Dashboard", "Projects", "Team"];

const NavLink = (props: Props) => {
  const { children } = props;

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function AppBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      console.log("sign out success!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "black")} px={5}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar
                size={"sm"}
                src={
                  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                }
              />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>
                {auth ? "Logout" : "Logiing out..."}
              </MenuItem>
            </MenuList>
          </Menu>
          <Text fontSize="xl" fontWeight="bold" ml={4}>
            MyApp
          </Text>
          <SettingsIcon />
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
      <Box
        position="fixed"
        display={{ base: "block", sm: "none" }}
        bottom="0"
        left="0"
        width="100%"
        bg={useColorModeValue("gray.100", "gray.900")}
        boxShadow="lg"
        p={2}
      >
        <Flex justifyContent="space-around" alignItems="center">
          <Button>
            <Icon as={BsFillHouseDoorFill} />
          </Button>
          <Button>
            <Icon as={BsLightbulbFill} />
          </Button>
          <Button>
            <Icon as={BsBellFill} />
          </Button>
        </Flex>
      </Box>
    </>
  );
}
