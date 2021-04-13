import { useMemo } from 'react'

import { GroupMe } from 'lib/groupme'

export const useGroupMe = (accessToken) => {
  return useMemo(() => {
    return new GroupMe(accessToken)
  }, [accessToken])
}

