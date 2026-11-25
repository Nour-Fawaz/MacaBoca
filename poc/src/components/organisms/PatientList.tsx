import { Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router';
import { PatientRow } from '@molecules';
import type { Patient } from '../../data/mock';

type Props = { patients: Patient[] };

export function PatientList({ patients }: Props) {
  const navigate = useNavigate();

  if (patients.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        No patients found.
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {patients.map((p) => (
        <PatientRow key={p.id} patient={p} onClick={() => navigate(`/patients/${p.id}`)} />
      ))}
    </Stack>
  );
}
