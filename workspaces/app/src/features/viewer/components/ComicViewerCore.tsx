import { Suspense } from 'react';
import styled from 'styled-components';

import { useEpisode } from '../../episode/hooks/useEpisode';

import { ComicViewerPage } from './ComicViewerPage';

const IMAGE_WIDTH = 1075;
const IMAGE_HEIGHT = 1518;

const _Container = styled.div`
  position: relative;
`;

const _Wrapper = styled.div`
  --page-width: calc(100cqh / ${IMAGE_HEIGHT} * ${IMAGE_WIDTH});
  --padding-inline: calc(100cqw - var(--page-width) / 2);
  
  @container (aspect-ratio: ${IMAGE_WIDTH * 2} / ${IMAGE_HEIGHT}) {
    --padding-inline: calc((100cqw - 2 * var(--page-width)) / 2 + var(--page-width));
    &:nth-child(2n + 1) {
      scroll-margin-right: var(--page-width);
    }
    &:nth-child(2n - 1) {
      scroll-margin-left: var(--page-width);
    }
  }

  scroll-snap-type: x mandatory;

  background-color: black;
  cursor: grab;
  direction: rtl;
  display: grid;
  grid-auto-columns: var(--page-width);
  grid-auto-flow: column;
  grid-template-rows: minmax(auto, 100%);
  height: 100%;
  min-height: 500px;
  overflow-x: scroll;
  overflow-y: hidden;
  overscroll-behavior: none;
  padding-inline: var(--padding-inline);
  touch-action: none;
  transform: translate3d(0, 0, 0);

  &::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  episodeId: string;
};

const ComicViewerCore: React.FC<Props> = ({ episodeId }) => {
  const { data: episode } = useEpisode({ params: { episodeId } });

  return (
    <_Container>
      <_Wrapper>
        {episode.pages.map((page) => {
          return <ComicViewerPage key={page.id} pageImageId={page.image.id} />;
        })}
      </_Wrapper>
    </_Container>
  );
};

const ComicViewerCoreWithSuspense: React.FC<Props> = ({ episodeId }) => {
  return (
    <Suspense fallback={null}>
      <ComicViewerCore episodeId={episodeId} />
    </Suspense>
  );
};

export { ComicViewerCoreWithSuspense as ComicViewerCore };
