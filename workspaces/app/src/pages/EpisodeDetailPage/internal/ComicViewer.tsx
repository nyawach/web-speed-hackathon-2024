import styled from 'styled-components';

import { ComicViewerCore } from '../../../features/viewer/components/ComicViewerCore';

const IMAGE_WIDTH = 1075;
const IMAGE_HEIGHT = 1518;

const MIN_VIEWER_HEIGHT = 500;
const MAX_VIEWER_HEIGHT = 650;

const MIN_PAGE_WIDTH = Math.floor((MIN_VIEWER_HEIGHT / IMAGE_HEIGHT) * IMAGE_WIDTH);

const _Container = styled.div`
  position: relative;
`;

const _Wrapper = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  max-height: ${MAX_VIEWER_HEIGHT}px;
  overflow: hidden;

  --page-count-per-view: 1;
  --page-width: calc(100cqw / var(--page-count-per-view));
  --page-height: clamp(500, calc(var(--page-width) / ${IMAGE_WIDTH} * ${IMAGE_HEIGHT}));

  @container (width >= ${MIN_PAGE_WIDTH * 2}px) {
    --page-count-per-view: 2;
  }
`;

type Props = {
  episodeId: string;
};

export const ComicViewer: React.FC<Props> = ({ episodeId }) => {
  return (
    <_Container>
      <_Wrapper>
        <ComicViewerCore episodeId={episodeId} />
      </_Wrapper>
    </_Container>
  );
};
