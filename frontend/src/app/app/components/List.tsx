import { useEffect, useState } from 'react'
import { Divider, Flex, Avatar, Stack, StackDivider, Box, Text } from '@chakra-ui/react'
import { useAuthContext } from '@/app/auth_provider/AuthProvider'
import LikeButton from '../../components/LikeButton'
import DonmaiButton from '../../components/DonmaiButton'
import WaraButton from '../../components/WaraButton'

export default function List() {
  const [value, setValue] = useState([])
  const { user } = useAuthContext()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/post/', {
          method: 'GET',
        })
        if (res.ok) {
          const data = await res.json()
          setValue(data.message)
          console.log('Fetched data:', data)
          // 取得したデータを処理する
        } else {
          console.error('Error fetching tasks:', res.statusText)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Flex bgColor={'white'}>
      <Stack divider={<Divider borderColor="gray.500" />} spacing={0}>
        {value.map((item, index) => (
          <Box key={item['id']} mx={6} mt={5}>
            <Stack direction="row">
              <Avatar boxSize={10} />
              <Flex flex={1} direction="column" alignItems={'start'}>
                <Stack direction={'row'} alignItems={'center'}>
                  <Text fontSize={14} fontWeight={'bold'}>
                    ユーザー名
                  </Text>
                  <Text fontSize={12}>{item['created_at']}</Text>
                </Stack>
                <Box>
                  <Text fontSize={14} px={2} py={1}>
                    {item['text']}
                  </Text>
                </Box>
              </Flex>
              <Box minW={10} />
            </Stack>
            <Stack direction="row" mt={2}>
              <Box minW={10} />
              <Box mr={2}>
                {item['solution'] ? (
                  <Text fontSize={14} px={2} py={1}>
                    {item['solution']}
                  </Text>
                ) : (
                  <Text px={2} py={1}>
                    {item['text']}
                  </Text>
                )}
              </Box>
              <Avatar boxSize={10} mt={1} />
            </Stack>
            <Box textAlign={'end'} my={2}>
              {user && (
                <>
                  <DonmaiButton post_id={item['id']} dontminds={item['dontminds']} />
                  <LikeButton post_id={item['id']} learneds={item['learneds']} />
                  <WaraButton post_id={item['id']} likes={item['likes']} />
                </>
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </Flex>
  )
}
