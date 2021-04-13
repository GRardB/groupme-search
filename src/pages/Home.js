import React from 'react'

import { LandingPage } from 'pages/LandingPage'
import { Conversations } from 'pages/Conversations'
import { useUserAccount } from 'hooks/user-account'

export const Home = () => {
  const { accessToken } = useUserAccount()

  return (
    <>
      {!accessToken && <LandingPage />}
      {accessToken && <Conversations />}
    </>
  )
}

