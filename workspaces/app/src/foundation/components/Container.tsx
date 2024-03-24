import React from 'react';
import styled from 'styled-components';

import { BreakPoint, Color } from '../styles/variables';

const _Container = styled.div<{ hasHeader: boolean }>`
min-height: 100vh;
width: 100%;
margin: 0 auto;
max-width: ${BreakPoint.MOBILE}px;
display: grid;
grid-template-columns: 100%;
grid-template-rows: ${({ hasHeader }) => (hasHeader ? 'auto 1fr auto' : '1fr auto')};
background-color: ${Color.MONO_A};
border-left: 1px solid ${Color.MONO_30};
border-right: 1px solid ${Color.MONO_30};
`;

type Props = {
  children: React.ReactNode;
  hasHeader?: boolean
};

export const Container: React.FC<Props> = ({ children, hasHeader = false }) => {
  return <_Container hasHeader={hasHeader}>{children}</_Container>;
};
