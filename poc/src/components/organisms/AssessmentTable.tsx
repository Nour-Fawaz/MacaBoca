import { Group, Select, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconClipboardText } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { WarningChip } from '@atoms';
import { RowCard, SectionCard } from '@molecules';
import { formatDate, type Assessment } from '../../data/mock';

type Props = {
  assessments: Assessment[];
  title?: string;
  patientName?: (a: Assessment) => string; // shown when listing across patients
};

// assessment rows in the same card style as the patient list
export function AssessmentTable({ assessments, title = 'Completed assessments', patientName }: Props) {
  const navigate = useNavigate();
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState('all');

  const rows = assessments
    .filter((a) => status === 'all' || (status === 'reviewed') === a.reviewed)
    .sort((a, b) => (sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

  const count = rows.length === assessments.length ? `${rows.length}` : `${rows.length} of ${assessments.length}`;

  return (
    <SectionCard
      title={`${title} (${count})`}
      right={
        <Group gap="xs">
          <Select
            size="xs"
            w={190}
            allowDeselect={false}
            value={sort}
            onChange={(v) => setSort(v ?? 'newest')}
            data={[
              { value: 'newest', label: 'Sort: Date (newest first)' },
              { value: 'oldest', label: 'Sort: Date (oldest first)' },
            ]}
          />
          <Select
            size="xs"
            w={210}
            allowDeselect={false}
            value={status}
            onChange={(v) => setStatus(v ?? 'all')}
            data={[
              { value: 'all', label: 'Review status: All' },
              { value: 'reviewed', label: 'Review status: Reviewed' },
              { value: 'not', label: 'Review status: Not reviewed' },
            ]}
          />
        </Group>
      }
    >
      {rows.length === 0 ? (
        <Text size="sm" c="dimmed">
          No assessments match this filter.
        </Text>
      ) : (
        <Stack gap="sm">
          {rows.map((a) => (
            <RowCard
              key={a.id}
              onClick={() => navigate(`/assessments/${a.id}`)}
              left={
                <ThemeIcon size={38} radius="md" variant="light">
                  <IconClipboardText size={20} />
                </ThemeIcon>
              }
              title={patientName ? `${patientName(a)} · ${a.name}` : a.name}
              meta={a.language}
              subtitle={`${formatDate(a.date)} · Score ${a.score} / ${a.maxScore} (${Math.round((a.score / a.maxScore) * 100)}%)`}
              right={
                // chip only when it still needs review
                !a.reviewed && <WarningChip label="Not reviewed" />
              }
            />
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
