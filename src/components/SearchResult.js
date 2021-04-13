import React, { useMemo } from 'react'

export const SearchResult = ({ message }) => {
  const date = useMemo(() => {
    return message ? new Date(message.created_at * 1000).toLocaleString() : ''
  }, [message])

  if (!message) {
    return null
  }

  return (
    <div className="flex items-start mb-4 text-sm">
      <img
        src={message.avatar_url}
        className="w-10 h-10 rounded mr-3"
        alt={message.name}
      />
      <div className="flex-1 overflow-hidden">
        <div>
          <span className="font-bold">{message.name}</span>
          <span className="text-gray text-xs ml-1">{date}</span>
        </div>
        <p className="text-black leading-normal">{message.text}</p>
      </div>
    </div>
  )
}

