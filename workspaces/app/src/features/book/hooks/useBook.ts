import useSWR from 'swr';

import { bookApiClient } from '../apiClient/bookApiClient';

export function useBook(...[options]: Parameters<typeof bookApiClient.fetch>) {
  return useSWR(
    bookApiClient.fetch$$key(options),
    bookApiClient.fetch,
    {
      fallbackData: {
        author: { description: '', id: '', image: { alt: '', id: '' }, name: '' },
        description: '',
        episodes: [],
        id: '',
        image: { alt: '', id: '' },
        name: '',
        nameRuby: '',
      },
      ssr: true,
      suspense: true,
    }
  )
}
