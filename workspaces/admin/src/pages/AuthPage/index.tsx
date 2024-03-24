import { Flex } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useAuthUser } from '../../features/auth/hooks/useAuthUser';

import { LoginContent } from './internal/LoginContent';
import { LogoutContent } from './internal/LogoutContent';

export const AuthPage: React.FC = () => {
  const { data: user } = useAuthUser();

  const Content = useMemo(() => user == null ? <LoginContent /> : <LogoutContent />, [user])
  return (
    <Flex align="stretch" direction="column" justify="center" minHeight="100%" w="100%">
      {Content}
    </Flex>
  );
};
