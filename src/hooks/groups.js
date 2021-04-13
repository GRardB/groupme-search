import { useState, useEffect, useMemo } from 'react'
import { orderBy } from 'lodash'
import createPersistedState from 'use-persisted-state'

import { useUserAccount } from 'hooks/user-account'
import { useGroupMe } from 'hooks/groupme'

const useEarliestStoredMessageState = createPersistedState(
  'last-stored-message',
)

export const useGroups = () => {
  const { accessToken } = useUserAccount()
  const client = useGroupMe(accessToken)

  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState([])

  useEffect(() => {
    client.getGroups().then((groups) => {
      setGroups(orderBy(groups, 'messages.last_message_created_at', 'desc'))
      setIsLoading(false)
    })
  }, [setGroups, setIsLoading, client])

  return {
    isLoading,
    groups,
  }
}

export const useGroupMessages = (groupId) => {
  const { accessToken } = useUserAccount()
  const client = useGroupMe(accessToken)
  const [
    earliestStoredMessageState,
    setEarliestStoredMessageState,
  ] = useEarliestStoredMessageState({})

  const [progress, setProgress] = useState(0)
  const [messages, setMessages] = useState([])
  const [targetMessageCount, setTargetMessageCount] = useState(0)

  const totalMessageCountRequest = useMemo(() => {
    return client.getGroupMessagesCount(groupId)
  }, [groupId, client])

  useEffect(() => {
    ;(async () => {
      const totalMessageCount = await totalMessageCountRequest

      const storedMessageCount = await client.getGroupStoredMessagesCount(
        groupId,
      )
      const earliestStoredMessageId = earliestStoredMessageState[groupId]

      if (storedMessageCount < totalMessageCount) {
        const messages = await client.backfillGroupMessages(
          groupId,
          earliestStoredMessageId,
        )

        if (messages.length) {
          const earliestMessage = messages[messages.length - 1]

          setEarliestStoredMessageState({
            ...earliestStoredMessageState,
            [groupId]: earliestMessage.id,
          })
        }
      } else if (earliestStoredMessageId) {
        setEarliestStoredMessageState({
          ...earliestStoredMessageState,
          [groupId]: null,
        })
      }

      setProgress(Math.round((storedMessageCount / totalMessageCount) * 100))
    })()
  }, [
    client,
    totalMessageCountRequest,
    earliestStoredMessageState,
    setEarliestStoredMessageState,
    setProgress,
    setTargetMessageCount,
    targetMessageCount,
    groupId,
  ])

  useEffect(() => {
    ;(async () => {
      setMessages(
        progress === 100 ? await client.getGroupMessages(groupId) : [],
      )
    })()
  }, [progress, setMessages, client, groupId])

  return {
    progress,
    messages,
  }
}

export const useGroupMessage = (groupId, messageId) => {
  const { accessToken } = useUserAccount()
  const client = useGroupMe(accessToken)

  const [message, setMessage] = useState(null)

  useEffect(() => {
    ;(async () => {
      setMessage(await client.getGroupMessage(groupId, messageId))
    })()
  }, [groupId, messageId, setMessage, client])

  return message
}

