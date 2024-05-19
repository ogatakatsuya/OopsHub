'use client'

import { Button, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { BsEmojiGrin } from 'react-icons/bs'
import { Tooltip } from '@chakra-ui/react'

import { auth } from '../firebase'

interface LikeButtonProps {
  post_id: number
  likes: number
}

const LikeButton: React.FC<LikeButtonProps> = ({ post_id, likes }) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [likeNum, setLikeNum] = useState(likes)
  const [liked, setLiked] = useState(false) // いいねの状態を管理するステート
  const user_id = auth.currentUser?.uid

  const toggleLike = async () => {
    const method = liked ? 'DELETE' : 'POST' // 現在の状態に応じてアクションを切り替える
    try {
      const res = await fetch(`http://localhost:8000/like/${post_id}/`, {
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
        setLikeNum(data.likes)
        setLiked(!liked) // いいねの状態を反転
        setSubmitError(null) // 成功時に以前のエラーをクリア
      }
    } catch (err) {
      setSubmitError('ネットワークエラーです。後で再試行してください。')
      console.error('ネットワークエラー:', err)
    }
  }

<<<<<<< HEAD
  return (
    <>
      <Tooltip label="笑った" fontSize="md">
        <Button bgColor={'white'} mr={5} size="10px" onClick={toggleLike}>
          <BsEmojiGrin /> <Text ml={1}>{likeNum}</Text>
        </Button>
      </Tooltip>
    </>
  )
=======
    return (
        <>
            <span>{likeNum}</span>
            <Button mr={3} size='xs' onClick={toggleLike}>
                笑った
            </Button>
        </>
    )
>>>>>>> e9b1cf6ef6119aa72e0a331e25efaa789498f8d6
}

export default LikeButton
