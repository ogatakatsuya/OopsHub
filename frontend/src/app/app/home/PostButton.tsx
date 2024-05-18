import React, { useEffect, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { redirect } from "next/navigation";

export default function PostButton() {
  const postButton = () => {
    redirect("/app/post");
  };

  return (
    <>
      <Box
        onClick={postButton}
        position="fixed"
        bottom={["75px", "50px"]}
        right={["20px", "50px"]}
        zIndex={10}
      >
        <Button
          bgColor="black"
          color="white"
          variant="solid"
          borderRadius="50%"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
          width="56px"
          height="56px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)" }}
          _active={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <AddIcon boxSize={6} />
        </Button>
      </Box>
    </>
  );
}
