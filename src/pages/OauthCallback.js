import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import { useUserAccount } from 'hooks/user-account'
import { getQueryParams } from 'util/url'

export const OauthCallback = () => {
  const { accessToken, setAccessToken } = useUserAccount()

  useEffect(() => {
    const queryParams = getQueryParams()
    if (queryParams.access_token) {
      setAccessToken(queryParams.access_token)
    }
  }, [setAccessToken])

  if (accessToken) {
    return <Redirect to="/" />
  }

  return <div>Something went wrong</div>
}

