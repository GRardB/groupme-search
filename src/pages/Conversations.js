import React from 'react'
import { MenuIcon } from '@heroicons/react/outline'
import { Route } from 'react-router-dom'

import { useMe } from 'hooks/user-account'
import { useGroups } from 'hooks/groups'
import { useToggle } from 'hooks/toggle'
import { DesktopChatList, MobileChatList } from 'components/ChatList'
import { GroupConversation } from 'pages/GroupConversation'

export const Conversations = () => {
  const [isMobileSidebarOpen, toggleMobileSidebar] = useToggle()

  const { isLoading: isLoadingGroups, groups } = useGroups()
  const { isLoading: isLoadingMe, me } = useMe()

  return (
    <>
      <div className="h-screen flex overflow-hidden bg-gray-100">
        {!isLoadingMe && !isLoadingGroups && (
          <>
            {isMobileSidebarOpen && (
              <MobileChatList
                onClose={toggleMobileSidebar}
                groups={groups}
                user={me}
              />
            )}
            <DesktopChatList groups={groups} user={me} />
          </>
        )}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
            <button
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={toggleMobileSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
          <main
            className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
            tabIndex={0}
          >
            <div className="py-6">
              <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
                <Route
                  path="/groups/:groupId"
                  children={<GroupConversation />}
                />
                <Route exact path="/">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Choose a conversation to begin searching
                  </h1>
                </Route>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

