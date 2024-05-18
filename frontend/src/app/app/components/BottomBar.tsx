import React from "react";
import { Box, Button, Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import {
  BsFillHouseDoorFill,
  BsLightbulbFill,
  BsBellFill,
} from "react-icons/bs";

export default function BottomBar() {
  return (
    <>
      <Box
        position="fixed"
        display={{ base: "block", sm: "none" }}
        bottom="0"
        left="0"
        width="100%"
        bg={useColorModeValue("gray.100", "gray.900")}
        boxShadow="lg"
        px={2}
      >
        <Flex h={14} justifyContent="space-between" alignItems="center">
          <Button
            flex={"1"}
            variant="ghost"
            width="50px"
            height="50px"
            _active={{
              bg: "gray.300",
              borderRadius: "50%",
            }}
          >
            <Icon as={BsFillHouseDoorFill} boxSize={5} />
          </Button>
          <Button
            flex={"1"}
            variant="ghost"
            width="50px"
            height="50px"
            _active={{
              bg: "gray.300",
              borderRadius: "50%",
            }}
          >
            <Icon as={BsLightbulbFill} boxSize={5} />
          </Button>
          <Button
            flex={"1"}
            variant="ghost"
            width="50px"
            height="50px"
            _active={{
              bg: "gray.300",
              borderRadius: "50%",
            }}
          >
            <Icon as={BsBellFill} boxSize={5} />
          </Button>
        </Flex>
      </Box>
    </>
  );
}
