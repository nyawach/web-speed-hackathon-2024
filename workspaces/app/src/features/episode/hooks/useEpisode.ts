import useSWR from 'swr'; // Import SWRResponse

import { episodeApiClient } from '../apiClient/episodeApiClient';

export function useEpisode(...[options]: Parameters<typeof episodeApiClient.fetch>) {
  return useSWR(episodeApiClient.fetch$$key(options), episodeApiClient.fetch, {
    fallbackData: {
      book: {
        author: {
          description: '',
          id: '',
          image: { alt: '', id: '' },
          name: '',
          nameRuby: '',
        },
        description: '',
        id: '',
        image: { alt: '', id: '' },
        name: '',
        nameRuby: '',
      },
      chapter: 0,
      description: '',
      id: '',
      image: { alt: '', id: '' },
      name: '',
      nameRuby: '',
      pages: [],
    },
    suspense: true,
  });
}
