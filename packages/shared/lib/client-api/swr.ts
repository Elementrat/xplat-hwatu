export interface SWRState {
    isLoading: boolean,
    isValidating: boolean,
    isError: boolean
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

  const fetchConfigs = {
    preservePrevious:   {
        keepPreviousData: true,
        throwOnError: true,
        revalidate: false,
      }
  }

  export { fetchConfigs, fetcher }