import { useCallback, useState, useEffect } from 'react'
import createPersistedState from 'use-persisted-state'

import { useGroupMe } from 'hooks/groupme'

const useAccountState = createPersistedState('account')

export const useUserAccount = () => {
  const [accessToken, setAccessToken] = useAccountState(null)

  const logOut = useCallback(() => setAccessToken(null), [setAccessToken])

  return {
    accessToken,
    setAccessToken,
    logOut,
  }
}

export const useMe = () => {
  const { accessToken } = useUserAccount()
  const client = useGroupMe(accessToken)

  const [isLoading, setIsLoading] = useState(true)
  const [me, setMe] = useState(null)

  useEffect(() => {
    client.getMe().then(({ data }) => {
      setMe(data.response)
      setIsLoading(false)
    })
  }, [setMe, setIsLoading, client])

  return {
    isLoading,
    me,
  }
}

