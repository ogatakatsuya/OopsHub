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

  return (
    <>
      <Box
        position="fixed"
        display={{ base: 'block' }}
        width="100%"
        bg={useColorModeValue('gray.100', 'black')}
        px={5}
        zIndex={30}
        opacity={opacity}
        transition="opacity 0.3s"
      >
        <Box display={{ base: 'block', sm: 'none' }}>
          <Flex h={14} alignItems={'center'} justifyContent={'space-between'}>
            <AvatarMenu />
            <Text fontSize="xl" fontWeight="bold" ml={4}>
              OopsHub
            </Text>
            <SettingsIcon boxSize={5} />
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
            <AvatarMenu />
          </Flex>
        </Box>
      </Box>
    </>
  )
}

const AvatarMenu = () => {
  const router = useRouter()

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
    <Menu>
      <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
        <Avatar
          size={'sm'}
          src={
            'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
          }
        />
      </MenuButton>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>{auth ? 'Logout' : 'Logiing out...'}</MenuItem>
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
                href={navItem.href ?? '#'}
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
    label: 'Home',
    href: '/app/home',
  },
  {
    label: 'Contest',
    children: [
      {
        label: 'View Contest',
        subLabel: 'Join the latest contest',
        href: '/app/contest',
      },
      {
        label: 'Contest Status',
        subLabel: 'See your contest status',
      },
    ],
  },
  {
    label: 'Help',
  },
]
