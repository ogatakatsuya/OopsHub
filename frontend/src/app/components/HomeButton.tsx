'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@chakra-ui/react'

const HomeButton = ({ children }: any) => {
  const router = useRouter()
  const clickHandler = () => {
    router.push('/app/home')
  }

  return (
    <Button
      flex={'1'}
      variant="ghost"
      width="50px"
      height="50px"
      _active={{
        bg: 'gray.300',
        borderRadius: '50%',
      }}
      onClick={clickHandler}
    >
      {children}
    </Button>
  )
}

export default HomeButton
