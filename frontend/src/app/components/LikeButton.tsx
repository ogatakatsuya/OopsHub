'use client'

import { Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { BsLightbulb } from 'react-icons/bs'
import { Tooltip } from '@chakra-ui/react'

import { auth } from '../firebase'

interface LikeButtonProps {
  post_id: number
  learneds: number
}

const LikeButton: React.FC<LikeButtonProps> = ({ post_id, learneds }) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [learnedNum, setLearnedNum] = useState(learneds)
  const [liked, setLiked] = useState(false)
  const user_id = auth.currentUser?.uid

  const toggleLike = async () => {
    const method = liked ? 'DELETE' : 'POST'
    try {
      const res = await fetch(`http://localhost:8000/learned/${post_id}/`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user_id }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        setSubmitError(errorData.message || '何か問題が発生しました')
      } else {
        const data = await res.json()
        console.log(data)
        setLearnedNum(data.learneds)
        setLiked(!liked)
        setSubmitError(null)
      }
    } catch (err) {
      setSubmitError('ネットワークエラーです。後で再試行してください。')
      console.error('ネットワークエラー:', err)
    }
  }

  return (
    <>
      <Tooltip label="ためになる" fontSize="md">
        <Button bgColor={'gray.50'} mr={5} size="10px" onClick={toggleLike}>
          <BsLightbulb />
          <Text ml={1} fontSize={12}>
            {learnedNum}
          </Text>
        </Button>
      </Tooltip>
    </>
  )
}

export default LikeButton
