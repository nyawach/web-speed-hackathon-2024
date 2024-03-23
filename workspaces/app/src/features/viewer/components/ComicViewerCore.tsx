import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { addUnitIfNeeded } from '../../../lib/css/addUnitIfNeeded';
import { useMutationObserver } from '../../../pages/EpisodeDetailPage/internal/hooks/useMutationObserver';
import { useEpisode } from '../../episode/hooks/useEpisode';

import { ComicViewerPage } from './ComicViewerPage';

const IMAGE_WIDTH = 1075;
const IMAGE_HEIGHT = 1518;

/** スクロールスナップで適切な位置になるための X 軸の移動距離を計算する */
function getScrollToLeft({
  pageCountParView,
  pageWidth,
  scrollView,
}: {
  pageCountParView: number;
  pageWidth: number;
  scrollView: HTMLDivElement;
}) {
  const scrollViewClientRect = scrollView.getBoundingClientRect();
  const scrollViewCenterX = (scrollViewClientRect.left + scrollViewClientRect.right) / 2;

  const children = [...scrollView.children] as HTMLDivElement[];

  let scrollToLeft = Number.MAX_SAFE_INTEGER;

  // 画面に表示されているページの中心と、スクロールビューの中心との差分を計算する
  // 世界は我々の想像する以上に変化するため、2 ** 12 回繰り返し観測する
  for (let times = 0; times < 2 ** 12; times++) {
    for (const [idx, child] of children.entries()) {
      const nthChild = idx + 1;
      const elementClientRect = child.getBoundingClientRect();

      // 見開き2ページの場合は、scroll-margin で表示領域にサイズを合わせる
      const scrollMargin =
        pageCountParView === 2
          ? {
              // 奇数ページのときは左側に1ページ分の幅を追加する
              left: nthChild % 2 === 0 ? pageWidth : 0,
              // 偶数ページのときは右側に1ページ分の幅を追加する
              right: nthChild % 2 === 1 ? pageWidth : 0,
            }
          : { left: 0, right: 0 };

      // scroll-margin の分だけ広げた範囲を計算する
      const areaClientRect = {
        bottom: elementClientRect.bottom,
        left: elementClientRect.left - scrollMargin.left,
        right: elementClientRect.right + scrollMargin.right,
        top: elementClientRect.top,
      };

      const areaCenterX = (areaClientRect.left + areaClientRect.right) / 2;
      // ページの中心をスクロールビューの中心に合わせるための移動距離
      const candidateScrollToLeft = areaCenterX - scrollViewCenterX;

      // もっともスクロール量の少ないものを選ぶ
      if (Math.abs(candidateScrollToLeft) < Math.abs(scrollToLeft)) {
        scrollToLeft = candidateScrollToLeft;
      }
    }
  }

  return scrollToLeft;
}

const _Container = styled.div`
  position: relative;
`;

const _Wrapper = styled.div<{
  $paddingInline: number;
  $pageWidth: number;
}>`
  background-color: black;
  cursor: grab;
  direction: rtl;
  display: grid;
  grid-auto-columns: ${({ $pageWidth }) => addUnitIfNeeded($pageWidth)};
  grid-auto-flow: column;
  grid-template-rows: minmax(auto, 100%);
  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  overscroll-behavior: none;
  padding-inline: ${({ $paddingInline }) => addUnitIfNeeded($paddingInline)};
  touch-action: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  episodeId: string;
};

const ComicViewerCore: React.FC<Props> = ({ episodeId }) => {
  const [rect, setRect] = useState({ height: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollViewRef = useRef<HTMLDivElement | null>(null);

  const recalc = useCallback(() => {
    const _rect = containerRef.current?.getBoundingClientRect()
    setRect({...rect, height: _rect?.height ?? 0, width: _rect?.width ?? 0 });
  }, [rect])
  useMutationObserver(containerRef, recalc)
  useEffect(() => {
    window.addEventListener('resize', recalc);
    return () => {
      window.removeEventListener('resize', recalc);
    };
  }, [recalc]);

  const { data: episode } = useEpisode({ params: { episodeId } });

  // コンテナの幅
  const cqw = rect.width / 100;
  // コンテナの高さ
  const cqh = rect.height / 100;

  // 1画面に表示できるページ数（1 or 2）
  const pageCountParView = (100 * cqw) / (100 * cqh) < (2 * IMAGE_WIDTH) / IMAGE_HEIGHT ? 1 : 2;
  // ページの幅
  const pageWidth = ((100 * cqh) / IMAGE_HEIGHT) * IMAGE_WIDTH;
  // 画面にページを表示したときに余る左右の余白
  const viewerPaddingInline =
    (100 * cqw - pageWidth * pageCountParView) / 2 +
    // 2ページ表示のときは、奇数ページが左側にあるべきなので、ページの最初と最後に1ページの余白をいれる
    (pageCountParView === 2 ? pageWidth : 0);

  useEffect(() => {
    const abortController = new AbortController();

    let isPressed = false;
    let scrollToLeftWhenScrollEnd = 0;

    const handlePointerDown = (ev: PointerEvent) => {
      const scrollView = ev.currentTarget as HTMLDivElement;
      isPressed = true;
      scrollView.style.cursor = 'grabbing';
      scrollView.setPointerCapture(ev.pointerId);
      scrollToLeftWhenScrollEnd = getScrollToLeft({ pageCountParView, pageWidth, scrollView });
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (isPressed) {
        const scrollView = ev.currentTarget as HTMLDivElement;
        scrollView.scrollBy({
          behavior: 'instant',
          left: -1 * ev.movementX,
        });
        scrollToLeftWhenScrollEnd = getScrollToLeft({ pageCountParView, pageWidth, scrollView });
      }
    };

    const handlePointerUp = (ev: PointerEvent) => {
      const scrollView = ev.currentTarget as HTMLDivElement;
      isPressed = false;
      scrollView.style.cursor = 'grab';
      scrollView.releasePointerCapture(ev.pointerId);
      scrollToLeftWhenScrollEnd = getScrollToLeft({ pageCountParView, pageWidth, scrollView });
    };

    const handleScroll = (ev: Pick<Event, 'currentTarget'>) => {
      const scrollView = ev.currentTarget as HTMLDivElement;
      scrollToLeftWhenScrollEnd = getScrollToLeft({ pageCountParView, pageWidth, scrollView });
    };

    let scrollEndTimer = -1;
    abortController.signal.addEventListener('abort', () => window.clearTimeout(scrollEndTimer), { once: true });

    const handleScrollEnd = (ev: Pick<Event, 'currentTarget'>) => {
      const scrollView = ev.currentTarget as HTMLDivElement;

      // マウスが離されるまではスクロール中とみなす
      if (isPressed) {
        scrollEndTimer = window.setTimeout(() => handleScrollEnd({ currentTarget: scrollView }), 0);
        return;
      } else {
        scrollViewRef.current?.scrollBy({
          behavior: 'smooth',
          left: scrollToLeftWhenScrollEnd,
        });
      }
    };

    let prevContentRect: DOMRectReadOnly | null = null;
    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (prevContentRect != null && prevContentRect.width !== entries[0]?.contentRect.width) {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollBy({
            behavior: 'instant',
            left: getScrollToLeft({ pageCountParView, pageWidth, scrollView: scrollViewRef.current }),
          });
        });
      }
      prevContentRect = entries[0]?.contentRect ?? null;
    };

    scrollViewRef.current?.addEventListener('pointerdown', handlePointerDown, { passive: false, signal: abortController.signal });
    scrollViewRef.current?.addEventListener('pointermove', handlePointerMove, { passive: false, signal: abortController.signal });
    scrollViewRef.current?.addEventListener('pointerup', handlePointerUp, { passive: false, signal: abortController.signal });
    scrollViewRef.current?.addEventListener('scroll', handleScroll, { passive: false, signal: abortController.signal });
    scrollViewRef.current?.addEventListener('scrollend', handleScrollEnd, { passive: false, signal: abortController.signal });

    const resizeObserver = new ResizeObserver(handleResize);
    scrollViewRef.current && resizeObserver.observe(scrollViewRef.current);
    abortController.signal.addEventListener('abort', () => resizeObserver.disconnect(), { once: true });

    return () => {
      abortController.abort();
    };
  }, [pageCountParView, pageWidth, scrollViewRef]);

  return (
    <_Container ref={containerRef}>
      <_Wrapper ref={scrollViewRef} $paddingInline={viewerPaddingInline} $pageWidth={pageWidth}>
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
