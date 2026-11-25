import { Group, Stack, Text } from '@mantine/core';
import { SectionCard } from '@molecules';
import type { Patient } from '../../data/mock';

type Props = { patient: Patient };

// label / value rows with a thin divider between them
export function PatientProfile({ patient }: Props) {
  const rows = [
    ['Age', String(patient.age)],
    ['Gender', patient.gender],
    ['Language', patient.languages.join(', ')],
    ['Location', patient.location],
    ['Contact', patient.email],
  ];

  return (
    <SectionCard title="Patient profile">
      <Stack gap={0}>
        {rows.map(([label, value], i) => (
          <Group
            key={label}
            justify="space-between"
            py="sm"
            style={{ borderTop: i ? '1px solid var(--mantine-color-gray-2)' : undefined }}
          >
            <Text size="sm" c="dimmed">
              {label}
            </Text>
            <Text size="sm" fw={500}>
              {value || '-'}
            </Text>
          </Group>
        ))}
      </Stack>
    </SectionCard>
  );
}
