"use client"
import useSWR from 'swr'

const fetcher = (...args:any) => fetch(...args).then(res => res.json())

/*
const load = async () => {
    const res = await fetch('http://localhost:3000/api/cards')
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return res.json()
}*/


function useCards () {
    const { data, error, isLoading } = useSWR(`/api/cards`, fetcher)
   
    return {
      data,
      isLoading,
      isError: error
    }
  }

const cardAPI = {
    useCards
}

export default cardAPI;