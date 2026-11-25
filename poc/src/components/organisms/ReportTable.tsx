import { Stack, Text, ThemeIcon } from '@mantine/core';
import { IconFileText } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { StatusBadge } from '@atoms';
import { RowCard, SectionCard } from '@molecules';
import { formatDate, type Report } from '../../data/mock';

type Props = {
  reports: Report[];
  title?: string;
  patientName?: (r: Report) => string; // shown when listing across patients
};

export function ReportTable({ reports, title = 'Reports', patientName }: Props) {
  const navigate = useNavigate();

  return (
    <SectionCard title={`${title} (${reports.length})`}>
      {reports.length === 0 ? (
        <Text c="dimmed" size="sm">
          No reports yet.
        </Text>
      ) : (
        <Stack gap="sm">
          {reports.map((r) => (
            <RowCard
              key={r.id}
              onClick={() => navigate(`/assessments/${r.assessmentId}/report`)}
              left={
                <ThemeIcon size={38} radius="md" variant="light" color="gray">
                  <IconFileText size={20} />
                </ThemeIcon>
              }
              title={patientName ? `${patientName(r)} · ${r.title}` : r.title}
              subtitle={formatDate(r.date)}
              right={<StatusBadge label={r.status} color={r.status === 'Final' ? 'cyan' : 'gray'} />}
            />
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
