import { Group, Paper, Title } from '@mantine/core';
import type { ReactNode } from 'react';

type Props = { title: string; right?: ReactNode; children: ReactNode };

// white card with a title row
export function SectionCard({ title, right, children }: Props) {
  return (
    <Paper withBorder p="md" h="100%">
      <Group justify="space-between" mb="sm">
        <Title order={5}>{title}</Title>
        {right}
      </Group>
      {children}
    </Paper>
  );
}
