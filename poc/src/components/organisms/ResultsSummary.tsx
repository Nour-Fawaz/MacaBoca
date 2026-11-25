import { Group, SimpleGrid, Text } from '@mantine/core';
import { SectionCard, StatTile } from '@molecules';
import type { Assessment } from '../../data/mock';

type Props = { assessment: Assessment };

export function ResultsSummary({ assessment: a }: Props) {
  const verified = a.questions.filter((q) => q.verified).length;
  const flagged = a.questions.filter((q) => q.flag).length;

  return (
    <SectionCard
      title="Results summary"
      right={
        <Group gap={6} align="baseline">
          <Text size="sm" c="dimmed">
            Overall score
          </Text>
          <Text fw={700} size="xl">
            {a.score} / {a.maxScore}
          </Text>
        </Group>
      }
    >
      <SimpleGrid cols={3} spacing="sm">
        <StatTile label="Verified" value={verified} color="cyan" />
        <StatTile label="Unverified" value={a.questions.length - verified} />
        <StatTile label="Flagged" value={flagged} color="yellow" />
      </SimpleGrid>
    </SectionCard>
  );
}
