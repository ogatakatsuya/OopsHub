import React from 'react'
import { Box, Text, Button, Flex, Icon, useColorModeValue } from '@chakra-ui/react'
import { BsFillHouseDoorFill, BsBarChartFill, BsBellFill } from 'react-icons/bs'
import ContestButton from '../../components/ContestButton'
import HomeButton from '../../components/HomeButton'

export default function BottomBar() {
  return (
    <>
      <Box
        position="fixed"
        display={{ base: 'block', sm: 'none' }}
        bottom="0"
        left="0"
        width="100%"
        bg={useColorModeValue('gray.100', 'gray.900')}
        boxShadow="lg"
        px={2}
      >
        <Flex h={14} justifyContent="space-between" alignItems="center">
          <HomeButton>
            <Flex direction={'column'} alignItems={'center'}>
              <Icon as={BsFillHouseDoorFill} boxSize={5} />
              <Text mt={1} fontSize={11}>
                ホーム
              </Text>
            </Flex>
          </HomeButton>
          <ContestButton>
            <Flex direction={'column'} alignItems={'center'}>
              <Icon as={BsBarChartFill} boxSize={5} />
              <Text mt={1} fontSize={11}>
                コンテスト
              </Text>
            </Flex>
          </ContestButton>
          <Button
            flex={'1'}
            variant="ghost"
            width="50px"
            height="50px"
            _active={{
              bg: 'gray.300',
              borderRadius: '50%',
            }}
          >
            <Flex direction={'column'} alignItems={'center'}>
              <Icon as={BsBellFill} boxSize={5} />
              <Text mt={1} fontSize={11}>
                お知らせ
              </Text>
            </Flex>
          </Button>
        </Flex>
      </Box>
    </>
  )
}
