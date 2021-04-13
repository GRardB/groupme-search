import React from 'react'
import { XIcon, SearchIcon, ChatAltIcon } from '@heroicons/react/outline'
import { Link, useRouteMatch } from 'react-router-dom'

import { useUserAccount } from 'hooks/user-account'

export const DesktopChatList = ({ groups, user }) => {
  const { logOut } = useUserAccount()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 text-gray-200 gap-3">
              <SearchIcon className="h-9 w-9" />
              <h1 className="font-bold text-lg">
                Group<span className="text-blue-300">Me</span> Search
              </h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
              {groups.map((group) => (
                <DesktopChatLink key={group.id} group={group} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded"
                    src={user.image_url}
                    alt={user.name}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <button
                    className="text-xs font-medium text-gray-300 group-hover:text-gray-200"
                    onClick={logOut}
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DesktopChatLink = ({ group }) => {
  const match = useRouteMatch('/groups/:groupId')
  const isCurrent = match && match.params.groupId === group.id

  return (
    <Link
      to={`/groups/${group.id}`}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md gap-3
      ${
        isCurrent
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }
`}
    >
      {group.image_url && (
        <img
          className="inline-block h-9 w-9 rounded"
          src={group.image_url}
          alt={group.name}
        />
      )}
      {!group.image_url && <ChatAltIcon className="h-9 w-9" />}
      {group.name}
    </Link>
  )
}

export const MobileChatList = ({ onClose, groups, user, currentGroupId }) => {
  const { logOut } = useUserAccount()

  return (
    <div
      className="fixed inset-0 flex z-40 md:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-75"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4 text-gray-200 gap-3">
            <SearchIcon className="h-9 w-9" />
            <h1 className="font-bold text-lg">
              Group<span className="text-blue-300">Me</span> Search
            </h1>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {groups.map((group) => (
              <MobileChatLink key={group.id} group={group} onClick={onClose} />
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-10 w-10 rounded"
                  src={user.image_url}
                  alt={user.name}
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">{user.name}</p>
                <button
                  className="text-sm font-medium text-gray-400 group-hover:text-gray-300"
                  onClick={logOut}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-14">
        {/* Force sidebar to shrink to fit close icon */}
      </div>
    </div>
  )
}

const MobileChatLink = ({ group, onClick }) => {
  const { match } = useRouteMatch('/groups/:groupId')
  const isCurrent = match && match.params.groupId === group.id

  return (
    <Link
      to={`/groups/${group.id}`}
      onClick={onClick}
      className={`
      ${
        isCurrent
          ? 'bg-gray-900 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }
      group flex items-center px-2 py-2 text-base font-medium rounded-md gap-3
      `}
    >
      {group.image_url && (
        <img
          className="inline-block h-9 w-9 rounded"
          src={group.image_url}
          alt={group.name}
        />
      )}
      {!group.image_url && <ChatAltIcon className="h-9 w-9" />}
      {group.name}
    </Link>
  )
}

