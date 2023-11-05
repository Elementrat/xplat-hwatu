"use client"
import useSWR from 'swr'

const fetcher = (...args:any) => fetch(...args).then(res => res.json())


function useCards () {
    const { data, error, isLoading } = useSWR(`http://localhost:3000/api/cards`, fetcher)
   
    return {
      data,
      isLoading,
      isError: error
    }
  }


export { useCards }