import React, { useCallback } from 'react'
import { SearchIcon } from '@heroicons/react/outline'

export const SearchInput = ({ disabled, onChange }) => {
  const updateSearch = useCallback((e) => onChange(e.target.value), [onChange])

  return (
    <>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="query"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
            placeholder="Search"
            disabled={disabled}
            onChange={updateSearch}
          />
        </div>
      </div>
    </>
  )
}

