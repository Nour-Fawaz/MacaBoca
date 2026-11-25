import { Box, Group, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import classes from './RowCard.module.css';

type Props = {
  left: ReactNode; // avatar or icon
  title: string;
  meta?: string; // grey text next to the title
  subtitle: ReactNode;
  right?: ReactNode;
  onClick: () => void;
};

// clickable card row, based on linkedout's people row
export function RowCard({ left, title, meta, subtitle, right, onClick }: Props) {
  return (
    <div className={classes.row} onClick={onClick}>
      {left}
      <Box style={{ flexGrow: 1 }}>
        <Group gap="xs">
          <Text className={classes.name} fw={500}>
            {title}
          </Text>
          {meta && (
            <Text size="sm" c="dimmed">
              {meta}
            </Text>
          )}
        </Group>
        <Text size="sm" c="dimmed" component="div">
          {subtitle}
        </Text>
      </Box>
      {right}
      <IconChevronRight size={18} color="var(--mantine-color-gray-6)" />
    </div>
  );
}
