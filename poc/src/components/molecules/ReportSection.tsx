import { Box, Group, Paper, Title } from '@mantine/core';
import type { ReactNode } from 'react';

type Props = { num: number; title: string; color: string; editing?: boolean; right?: ReactNode; children: ReactNode };

// colour-coded report section (supervisor feedback), dashed while editing
export function ReportSection({ num, title, color, editing, right, children }: Props) {
  return (
    <Paper
      withBorder
      style={{
        overflow: 'hidden',
        borderColor: `var(--mantine-color-${color}-${editing ? 4 : 2})`,
        borderStyle: editing ? 'dashed' : 'solid',
      }}
    >
      <Group
        justify="space-between"
        px="md"
        py="xs"
        bg={`${color}.0`}
        style={{ borderBottom: `1px solid var(--mantine-color-${color}-2)` }}
      >
        <Title order={5} c={`${color}.9`}>
          {num}. {title}
        </Title>
        {right}
      </Group>
      <Box p="md">{children}</Box>
    </Paper>
  );
}
