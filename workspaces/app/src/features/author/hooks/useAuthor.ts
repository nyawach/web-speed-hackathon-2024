import useSWR from 'swr';

import { authorApiClient } from '../apiClient/authorApiClient';

export function useAuthor(...[options]: Parameters<typeof authorApiClient.fetch>) {
  return useSWR(authorApiClient.fetch$$key(options), authorApiClient.fetch, {
    fallbackData: {
      books: [],
      description: '',
      id: '',
      image: {
        alt: '',
        id: '',
      },
      name: '',
    },
    suspense: true,
  });
}
