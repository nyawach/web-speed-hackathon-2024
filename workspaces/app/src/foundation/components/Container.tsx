import React from 'react';
import styled from 'styled-components';

import { BreakPoint, Color } from '../styles/variables';

const _BaseContainer = styled.div`
min-height: 100vh;
width: 100%;
margin: 0 auto;
max-width: ${BreakPoint.MOBILE}px;
display: grid;
grid-template-columns: 100%;
background-color: ${Color.MONO_A};
border-left: 1px solid ${Color.MONO_30};
border-right: 1px solid ${Color.MONO_30};
`

const _Container = styled(_BaseContainer)`
  grid-template-rows: 'auto 1fr auto';
`

const _ContainerWithoutHeader = styled(_BaseContainer)`
  grid-template-rows: '1fr auto';
`

type Props = {
  children: React.ReactNode;
  hasHeader?: boolean
};

export const Container: React.FC<Props> = ({ children, hasHeader = false }) => {
  return hasHeader
    ? <_Container>{children}</_Container>
    : <_ContainerWithoutHeader>{children}</_ContainerWithoutHeader>;
};
