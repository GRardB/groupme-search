import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { SearchInput } from 'components/SearchInput'
import { SearchResult } from 'components/SearchResult'
import { useGroupMessages } from 'hooks/groups'
import { useSearch } from 'hooks/search'
import { useDebounce } from 'hooks/debounce'

export const GroupConversation = () => {
  const { groupId } = useParams()
  const { progress, messages } = useGroupMessages(groupId)
  const { search, results, isBuildingIndex } = useSearch(groupId, messages)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  const isSearching = query !== debouncedQuery

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  return (
    <div>
      <SearchInput
        disabled={progress < 100 || isBuildingIndex}
        onChange={setQuery}
      />
      <div className="py-4">
        {progress < 100 && `Loading: ${progress}%`}
        {progress === 100 &&
          isBuildingIndex &&
          'Building search index (please hold)'}
        {isSearching && query.length > 0 && (
          <p>
            Searching for <strong>{query}</strong>
          </p>
        )}
        {progress === 100 && results.length > 0 && (
          <div>
            {results.map((message) => (
              <SearchResult key={message.id} message={message} />
            ))}
          </div>
        )}
        {progress === 100 &&
          query.length > 0 &&
          !isSearching &&
          results.length === 0 && (
            <p>
              No results found for <strong>{query}</strong>
            </p>
          )}
      </div>
    </div>
  )
}

