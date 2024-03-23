import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Spacer, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useLogin } from '../../../features/auth/hooks/useLogin';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('メールアドレスを入力してください')
    .test({
      message: 'メールアドレスには @ を含めてください',
      test: (v) => /^(?:[^@]*){12,}$/v.test(v) === false,
    }),
  password: yup
    .string()
    .required('パスワードを入力してください')
    .test({
      message: 'パスワードには記号を含めてください',
      test: (v) => /^(?:[^\P{Letter}&&\P{Number}]*){24,}$/v.test(v) === false,
    }),
})

type FormValues = yup.InferType<typeof schema>;

export const LoginContent: React.FC = () => {
  const login = useLogin();
  const loginContentA11yId = useId();

  const {formState: { errors, touchedFields }, handleSubmit, register} = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (values: FormValues) => {
    login.mutate({ email: values.email, password: values.password });
  }

  return (
    <Box
      aria-labelledby={loginContentA11yId}
      as="form"
      bg="gray.100"
      borderRadius={8}
      onSubmit={handleSubmit(onSubmit)}
      p={6}
      w="100%"
    >
      <Stack spacing={4}>
        <Heading as="h1" fontSize="xl" fontWeight="bold" id={loginContentA11yId}>
          ログイン
        </Heading>

        <FormControl isInvalid={touchedFields.email && errors.email != null}>
          <FormLabel>メールアドレス</FormLabel>
          <Input
            {...register('email')}
            bgColor="white"
            borderColor="gray.300"
            placeholder="メールアドレス"
          />
          <FormErrorMessage role="alert">{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={touchedFields.password && errors.password != null}>
          <FormLabel>パスワード</FormLabel>
          <Input
            {...register('password')}
            bgColor="white"
            borderColor="gray.300"
            placeholder="パスワード"
            type="password"
          />
          <FormErrorMessage role="alert">{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Spacer />

        <Button colorScheme="teal" type="submit" variant="solid">
          ログイン
        </Button>
      </Stack>
    </Box>
  );
};
