import { Anchor, Group, Text, ThemeIcon } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { Link } from 'react-router';
import { SectionCard } from '@molecules';
import type { Assessment } from '../../data/mock';

type Props = { assessment: Assessment };

export function TranscriptCard({ assessment: a }: Props) {
  return (
    <SectionCard title="Transcript">
      <Group gap="sm" wrap="nowrap">
        <ThemeIcon variant="light" color={a.transcribed ? 'cyan' : 'gray'}>
          <IconFileText size={16} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={600}>
            {a.transcribed ? 'Transcript annotated' : 'No transcript yet.'}
          </Text>
          <Anchor component={Link} to={`/assessments/${a.id}/safa`} size="xs">
            {a.transcribed ? 'Review in SAFA' : 'Open assessment in SAFA'}
          </Anchor>
        </div>
      </Group>
    </SectionCard>
  );
}
