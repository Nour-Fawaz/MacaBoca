import { Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';

// no real auth yet, sign in just goes to the patient list
export function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/patients');
  };

  return (
    <Center h="100vh" bg="gray.0">
      <Paper withBorder p="xl" w={360}>
        <form onSubmit={onSubmit}>
          <Stack>
            <div>
              <Title order={3}>TeLaC</Title>
              <Text size="sm" c="dimmed">
                Clinician sign in
              </Text>
            </div>
            <TextInput label="Email" placeholder="you@clinic.com" />
            <PasswordInput label="Password" placeholder="Password" />
            <Button type="submit" fullWidth>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
