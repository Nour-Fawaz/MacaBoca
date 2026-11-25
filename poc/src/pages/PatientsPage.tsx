import { Button, Group, Paper, TextInput } from '@mantine/core';
import { useState } from 'react';
import { PageHeader } from '@molecules';
import { AddPatientModal, PatientList } from '@organisms';
import { patients } from '../data/mock';

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const [list, setList] = useState(patients);
  const [adding, setAdding] = useState(false);

  const q = search.toLowerCase();
  const shown = list.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));

  return (
    <>
      <PageHeader title="Patients" subtitle={`${list.length} patients`} />
      <Paper withBorder p="md">
        <Group justify="space-between" mb="sm">
          <TextInput
            placeholder="Search by name or ID"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={280}
          />
          <Button onClick={() => setAdding(true)}>Add patient</Button>
        </Group>
        <PatientList patients={shown} />
      </Paper>

      <AddPatientModal
        opened={adding}
        nextId={`P-${String(124 + list.length).padStart(4, '0')}`}
        onClose={() => setAdding(false)}
        onAdd={(p) => {
          setList((l) => [...l, p]);
          setAdding(false);
        }}
      />
    </>
  );
}
