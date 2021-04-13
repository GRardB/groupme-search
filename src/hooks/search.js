import { useMemo, useCallback, useState } from 'react'
import lunr from 'lunr'
import { orderBy } from 'lodash'

import { useUserAccount } from 'hooks/user-account'
import { useGroupMe } from 'hooks/groupme'

export const useSearch = (groupId, messages) => {
  const { accessToken } = useUserAccount()
  const client = useGroupMe(accessToken)

  const [results, setResults] = useState([])
  const [isBuildingIndex, setIsBuildingIndex] = useState(true)

  const searchIndex = useMemo(() => {
    if (!messages.length) return

    return lunr(function () {
      this.ref('_id')
      this.field('text')

      messages.forEach(function (doc) {
        this.add(doc)
      }, this)

      setIsBuildingIndex(false)
    })
  }, [messages, setIsBuildingIndex])

  const search = useCallback(
    async (query) => {
      if (!searchIndex) return

      if (query.trim().length === 0) {
        setResults([])
        return
      }

      const messages = await Promise.all(
        searchIndex.search(query).map(({ ref: messageId }) => {
          return client.getGroupMessage(groupId, messageId)
        }),
      )

      setResults(orderBy(messages, 'created_at', 'asc'))
    },
    [searchIndex, setResults, client, groupId],
  )
  return { search, results, isBuildingIndex }
}

