import { Button, Grid, Stack, Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { PageHeader } from '@molecules';
import { AssessmentTable, EditProfileModal, PatientProfile, ReportTable, ScoreChart } from '@organisms';
import { findPatient } from '../data/mock';

export function PatientPage() {
  const { id } = useParams();
  return <PatientView key={id} id={id} />;
}

function PatientView({ id }: { id?: string }) {
  const found = findPatient(id);
  // local copy so profile edits show up (not saved anywhere)
  const [patient, setPatient] = useState(found);
  const [editing, setEditing] = useState(false);

  if (!patient) return <Text>Patient not found.</Text>;

  return (
    <>
      <PageHeader
        title={patient.name}
        subtitle={`ID ${patient.id}`}
        crumbs={[{ label: 'Patients', to: '/patients' }, { label: patient.name }]}
        right={
          <Button variant="default" leftSection={<IconPencil size={14} />} onClick={() => setEditing(true)}>
            Edit profile
          </Button>
        }
      />
      <Stack>
        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <PatientProfile patient={patient} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <ScoreChart assessments={patient.assessments} />
          </Grid.Col>
        </Grid>
        <AssessmentTable assessments={patient.assessments} />
        <ReportTable reports={patient.reports} />
      </Stack>

      <EditProfileModal
        opened={editing}
        patient={patient}
        onClose={() => setEditing(false)}
        onSave={(p) => {
          setPatient(p);
          setEditing(false);
        }}
      />
    </>
  );
}
