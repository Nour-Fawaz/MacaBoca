import { Paper, Text } from '@mantine/core';

type Props = { label: string; value: string | number; color?: string };

// small label + big number
export function StatTile({ label, value, color = 'gray' }: Props) {
  return (
    <Paper
      p="sm"
      bg={`${color}.0`}
      withBorder
      style={{ borderColor: `var(--mantine-color-${color}-2)` }}
    >
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text fw={700} size="xl" c={color === 'gray' ? undefined : `${color}.8`}>
        {value}
      </Text>
    </Paper>
  );
}
