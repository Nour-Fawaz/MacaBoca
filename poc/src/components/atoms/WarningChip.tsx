import { Badge, Tooltip } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

type Props = { label: string };

// icon-only yellow chip, label shows on hover
export function WarningChip({ label }: Props) {
  return (
    <Tooltip label={label}>
      <Badge
        variant="light"
        color="yellow"
        px={8}
        aria-label={label}
        style={{ border: '1px solid var(--mantine-color-yellow-3)' }}
      >
        <IconAlertTriangle size={12} style={{ display: 'block' }} />
      </Badge>
    </Tooltip>
  );
}
