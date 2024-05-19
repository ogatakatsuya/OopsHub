'use client'

import {
  CardHeader,
  StackDivider,
  Card,
  CardBody,
  Stack,
  Link,
  CardFooter,
  Button,
  Heading,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import BackButton from '@/app/components/BackButton'

import { Box, Text, Flex } from '@chakra-ui/react'

const Contest = () => {
  const [contest, setContest] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/contest/', {
          method: 'GET',
        })
        if (res.ok) {
          const data = await res.json()
          setContest(data.contests)
        } else {
          console.error('Error fetching tasks:', res.statusText)
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    console.log(contest) // contestが更新された後にログに出力
  }, [contest])

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  return (
    <>
      <Flex justify="center" alignItems="center" my={6}>
        <Heading
          as={'span'}
          position={'relative'}
          _after={{
            content: "''",
            width: 'full',
            height: '30%',
            position: 'absolute',
            bottom: 1,
            left: 0,
            bg: 'red.200',
            zIndex: -1,
          }}
        >
          開催中のコンテスト
        </Heading>
      </Flex>
      <Stack>
        {contest
          .filter((item) => item['available'])
          .map((item) => (
            <Flex justifyContent="center" my={4} key={item['contest_id']}>
              <Card width={{ sm: '80%', md: '70%', lg: '60%', xl: '50%' }}>
                <CardHeader>
                  <Heading size="lg">{item['name']}</Heading>
                </CardHeader>
                <CardBody>
                  <Text size="md">開始 : {item['created_at']}</Text>
                  <Text>締切 : {formatDate(item['deadline'])}</Text>
                </CardBody>
                <CardFooter>
                  <Flex justifyContent="flex-end" width="100%">
                    <Button as="a" href={`/app/contest/${item['contest_id']}`}>
                      参加
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            </Flex>
          ))}
      </Stack>
      <Flex justify="center" alignItems="center" my={6}>
        <Heading
          as={'span'}
          position={'relative'}
          _after={{
            content: "''",
            width: 'full',
            height: '30%',
            position: 'absolute',
            bottom: 1,
            left: 0,
            bg: 'blue.200',
            zIndex: -1,
          }}
        >
          過去のコンテスト
        </Heading>
      </Flex>
      <Stack>
        {contest
          .filter((item) => !item['available'])
          .map((item) => (
            <Flex justifyContent="center" my={4} key={item['contest_id']}>
              <Card width={{ sm: '80%', md: '70%', lg: '60%', xl: '50%' }}>
                <CardHeader>
                  <Heading size="lg">{item['name']}</Heading>
                </CardHeader>
                <CardBody>
                  <Text size="md">開始 : {item['created_at']}</Text>
                  <Text>締切 : {formatDate(item['deadline'])}</Text>
                </CardBody>
                <CardFooter>
                  <Flex justifyContent="flex-end" width="100%">
                    <Button as="a" href={`/app/contest/result/${item['contest_id']}`}>
                      結果を見る
                    </Button>
                  </Flex>
                </CardFooter>
              </Card>
            </Flex>
          ))}
      </Stack>
    </>
  )
}

export default Contest
