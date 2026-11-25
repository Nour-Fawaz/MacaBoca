import { Button, Grid, Paper, Stack, Text } from '@mantine/core';
import { IconFileText, IconWaveSine } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '@molecules';
import { NotesCard, QuestionList, RecordingPlayer, ResultsSummary, TranscriptCard } from '@organisms';
import { findAssessment, formatDate } from '../data/mock';

export function AssessmentPage() {
  const { id } = useParams();
  return <AssessmentView key={id} id={id} />;
}

function AssessmentView({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const found = findAssessment(id);

  if (!found) return <Text>Assessment not found.</Text>;
  const { patient, assessment: a } = found;
  const percent = Math.round((a.score / a.maxScore) * 100);

  return (
    <>
      <PageHeader
        title={`${a.name} · ${a.language}`}
        crumbs={[
          { label: 'Patients', to: '/patients' },
          { label: patient.name, to: `/patients/${patient.id}` },
          { label: a.name },
        ]}
        subtitle={`${formatDate(a.date)} · Overall score ${percent}%`}
        right={
          <Button leftSection={<IconFileText size={16} />} onClick={() => navigate(`/assessments/${a.id}/report`)}>
            Generate report
          </Button>
        }
      />

      <Paper bg="gray.1" withBorder p="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack>
              <RecordingPlayer
                duration={a.duration}
                time={time}
                setTime={setTime}
                markers={a.questions.map((q) => q.start)}
                label="Assessment recording"
              />
              <TranscriptCard assessment={a} />
              <NotesCard title="Assessment notes" placeholder="Notes about the assessment" initial={a.notes} />
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack>
              <ResultsSummary assessment={a} />
              <QuestionList assessment={a} onSeek={setTime} />
              <Button
                variant="default"
                leftSection={<IconWaveSine size={16} />}
                onClick={() => navigate(`/assessments/${a.id}/safa`)}
                style={{ alignSelf: 'flex-start' }}
              >
                Open full assessment in SAFA
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
}
