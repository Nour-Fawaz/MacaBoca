import { Badge } from '@mantine/core';

type Props = { label: string; color?: string };

// light badge with a thin border one shade darker
export function StatusBadge({ label, color = 'gray' }: Props) {
  return (
    <Badge
      variant="light"
      color={color}
      tt="none"
      fw={500}
      style={{ border: `1px solid var(--mantine-color-${color}-3)` }}
    >
      {label}
    </Badge>
  );
}
