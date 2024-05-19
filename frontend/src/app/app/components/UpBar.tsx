'use client'

import React from 'react'
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stack,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Icon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { useRouter } from 'next/navigation'
import { SettingsIcon } from '@chakra-ui/icons'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'

export default function AppBar() {
  const [opacity, setOpacity] = useState(1)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()

  const handleScroll = () => {
    const scrollY = window.scrollY
    const isScrollingUp = scrollY < lastScrollY

    if (isScrollingUp) {
      setOpacity((prevOpacity) => Math.min(1, prevOpacity + (lastScrollY - scrollY) / 300))
    } else {
      setOpacity((prevOpacity) => Math.max(0.7, prevOpacity - (scrollY - lastScrollY) / 300))
    }

    setLastScrollY(scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
      console.log('sign out success!')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box
        position="fixed"
        display={{ base: 'block' }}
        width="100%"
        bg={useColorModeValue('gray.100', 'black')}
        pl={5}
        zIndex={30}
        opacity={opacity}
        transition="opacity 0.3s"
      >
        <Box display={{ base: 'block', sm: 'none' }} width="100%">
          <Flex h={14} alignItems={'center'} justifyContent="space-between">
            <Text flex={1} fontSize="xl" fontWeight="bold" ml={4} textAlign="center">
              OopsHub
            </Text>
            <SettingMenu />
          </Flex>
        </Box>
        <Box display={{ base: 'none', sm: 'block' }}>
          <Flex h={14} alignItems={'center'} justifyContent={'space-between'}>
            <Flex>
              <Text textAlign={'left'} fontWeight="bold">
                OopsHub
              </Text>
              <Flex display={{ base: 'none', sm: 'flex' }} ml={10}>
                <DesktopNav />
              </Flex>
            </Flex>
            <Flex>
              <Button onClick={handleLogout}>
                <Text fontSize={'14px'}>{auth ? 'ログアウト' : 'ログアウト中...'}</Text>
              </Button>
              <SettingMenu />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}

const RenameButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = React.useRef(null)

  return (
    <>
      <Box textAlign={'left'} onClick={onOpen} width={'100%'}>
        名前を変更
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>名前を変更</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Some contents...</p>
            </ModalBody>
            <Box textAlign={'end'} mb={2} mr={2}>
              <Button variant="ghost" mr={2} onClick={onClose}>
                <Text fontSize={'14px'}>キャンセル</Text>
              </Button>
              <Button variant="solid">
                <Text fontSize={'14px'}>決定</Text>
              </Button>
            </Box>
          </ModalContent>
        </Modal>
      </Box>
    </>
  )
}

const SettingMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={'60px'}>
        <SettingsIcon boxSize={5} />
        <Text mt={1} fontSize={11}>
          設定
        </Text>
      </MenuButton>
      <MenuList>
        <MenuItem>
          <RenameButton />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  const router = useRouter()

  return (
    <Link
      onClick={() => {
        href && router.push(href)
      }}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('orange.50', 'pink.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'orange.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'gray.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'ホーム',
    href: '/app/home',
  },
  {
    label: 'コンテスト',
    children: [
      {
        label: 'コンテスト一覧',
        subLabel: '最新のコンテストを確認',
        href: '/app/contest',
      },
      {
        label: 'コンテスト参加状況',
        subLabel: 'コンテストに関するステータスを確認',
      },
    ],
  },
]
