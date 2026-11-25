import { Anchor, Box, Breadcrumbs, Group, Stack, Text, Title } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

type Crumb = { label: string; to?: string };
type Props = {
  title: string;
  subtitle?: ReactNode;
  crumbs?: Crumb[];
  back?: Crumb & { to: string };
  titleRight?: ReactNode; // small status next to the title
  right?: ReactNode; // page actions
};

export function PageHeader({ title, subtitle, crumbs, back, titleRight, right }: Props) {
  return (
    <Stack gap={4} mb="lg">
      {back && (
        <Anchor component={Link} to={back.to} size="sm" c="dimmed">
          <Group gap={2}>
            <IconChevronLeft size={14} />
            {back.label}
          </Group>
        </Anchor>
      )}
      {crumbs && (
        <Breadcrumbs separator="›" fz="sm">
          {crumbs.map((c) =>
            c.to ? (
              <Anchor key={c.label} component={Link} to={c.to} size="sm" c="dimmed">
                {c.label}
              </Anchor>
            ) : (
              <Text key={c.label} size="sm" c="dimmed">
                {c.label}
              </Text>
            ),
          )}
        </Breadcrumbs>
      )}
      {/* actions sit on the same line as the title */}
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="sm" align="center">
          <Title order={2}>{title}</Title>
          {titleRight}
        </Group>
        {right && <Box>{right}</Box>}
      </Group>
      {subtitle && (
        <Text size="sm" c="dimmed" component="div">
          {subtitle}
        </Text>
      )}
    </Stack>
  );
}
