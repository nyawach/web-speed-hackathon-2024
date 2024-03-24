import { Suspense, useId } from 'react';
import styled from 'styled-components';

import { BookCard } from '../../features/book/components/BookCard';
import { FeatureCard } from '../../features/feature/components/FeatureCard';
import { useFeatureList } from '../../features/feature/hooks/useFeatureList';
import { RankingCard } from '../../features/ranking/components/RankingCard';
import { useRankingList } from '../../features/ranking/hooks/useRankingList';
import { useRelease } from '../../features/release/hooks/useRelease';
import { Box } from '../../foundation/components/Box';
import { Flex } from '../../foundation/components/Flex';
import { Spacer } from '../../foundation/components/Spacer';
import { Text } from '../../foundation/components/Text';
import { Color, Space, Typography } from '../../foundation/styles/variables';
import { getDayOfWeekStr } from '../../lib/date/getDayOfWeekStr';

import { CoverSection } from './internal/CoverSection';

const _FeatureCardList = styled.div`
  display: flex;
  align-items: stretch;
  flex-direction: row;
  gap: ${Space * 2}px;
  justify-content: flex-start;
  min-height: 206px;
`

const PickupSection = () => {
  const pickupA11yId = useId();
  const { data: featureList } = useFeatureList({ query: {} });

  return (
    <Box aria-labelledby={pickupA11yId} as="section" maxWidth="100%" mt={16} width="100%">
      <Text as="h2" color={Color.MONO_100} id={pickupA11yId} typography={Typography.NORMAL20} weight="bold">
        ピックアップ
      </Text>
      <Spacer height={Space * 2} />
      <Box maxWidth="100%" overflowX="scroll" overflowY="hidden">
        <_FeatureCardList>
          {featureList.map((feature) => (
            <FeatureCard key={feature.id} book={feature.book} />
          ))}
        </_FeatureCardList>
      </Box>
    </Box>
  )
}

const _RankingCardList = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: ${Space * 2}px;
  min-height: 130px;
`

const RankingSection = () => {
  const { data: rankingList } = useRankingList({ query: {} });
  const rankingA11yId = useId();

  return (
    <Box aria-labelledby={rankingA11yId} as="section" maxWidth="100%" width="100%">
      <Text as="h2" color={Color.MONO_100} id={rankingA11yId} typography={Typography.NORMAL20} weight="bold">
        ランキング
      </Text>
      <Spacer height={Space * 2} />
      <Box maxWidth="100%" overflowX="hidden">
        <_RankingCardList>
          {rankingList.map((ranking) => (
            <RankingCard key={ranking.id} book={ranking.book} />
          ))}
        </_RankingCardList>
      </Box>
    </Box>
  )
}

const ReleaseSection = () => {
  const todayStr = getDayOfWeekStr(new Date());
  const { data: release } = useRelease({ params: { dayOfWeek: todayStr } });
  const todayA11yId = useId();

  return (
    <Box aria-labelledby={todayA11yId} as="section" maxWidth="100%" width="100%">
      <Text as="h2" color={Color.MONO_100} id={todayA11yId} typography={Typography.NORMAL20} weight="bold">
        本日更新
      </Text>
      <Spacer height={Space * 2} />
      <Box maxWidth="100%" overflowX="scroll" overflowY="hidden">
        <Flex align="stretch" gap={Space * 2} justify="flex-start">
          {release.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </Flex>
      </Box>
    </Box>
  )
}

const TopPage: React.FC = () => {
  return (
    <Flex align="flex-start" direction="column" gap={Space * 2} justify="center" pb={Space * 2}>
      <Box as="header" maxWidth="100%" width="100%">
        <CoverSection />
      </Box>
      <Box as="main" maxWidth="100%" width="100%">
        <PickupSection />
        <Spacer height={Space * 2} />
        <RankingSection />
        <Spacer height={Space * 2} />
        <ReleaseSection />
      </Box>
    </Flex>
  );
};

const TopPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <TopPage />
    </Suspense>
  );
};

export { TopPageWithSuspense as TopPage };
