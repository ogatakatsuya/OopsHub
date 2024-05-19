import React, { useEffect, useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import SubmitMordal from './SubmitMordal'

export default function PostButton({ contest_id }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box
        onClick={onOpen}
        position="fixed"
        bottom={['75px', '50px']}
        right={['20px', '50px']}
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
          _hover={{ boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
          _active={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
        >
          <AddIcon boxSize={6} />
        </Button>
      </Box>
      <SubmitMordal onClose={onClose} onOpen={onOpen} isOpen={isOpen} contest_id={contest_id} />
    </>
  )
}
