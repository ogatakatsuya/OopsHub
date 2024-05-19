'use client'

import { Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { BsHeart } from 'react-icons/bs'
import { Tooltip } from '@chakra-ui/react'

import { auth } from '../firebase'

interface LikeButtonProps {
  post_id: number
  dontminds: number
}

const DonmaiButton: React.FC<LikeButtonProps> = ({ post_id, dontminds }) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dontmindsNum, setDontmindsNum] = useState(dontminds)
  const user_id = auth.currentUser?.uid
  const like = async () => {
    try {
      const res = await fetch(`http://localhost:8000/dontmind/${post_id}/`, {
        // ポート番号を修正
        method: 'POST',
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
        setDontmindsNum(data.dont_minds)
        setSubmitError(null) // 成功時に以前のエラーをクリア
      }
    } catch (err) {
      setSubmitError('ネットワークエラーです。後で再試行してください。')
      console.error('ネットワークエラー:', err)
    }
  }
  return (
    <>
      <Tooltip label="どんまい" fontSize="md">
        <Button bgColor={'gray.50'} mr={5} size="10px" onClick={like}>
          <BsHeart />
          <Text fontSize={12} ml={1}>
            {dontmindsNum}
          </Text>
        </Button>
      </Tooltip>
    </>
  )
}

export default DonmaiButton
