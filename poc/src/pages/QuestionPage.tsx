import { ActionIcon, Badge, Button, Grid, Group, Paper, Stack, Switch, Text, Title, Tooltip } from '@mantine/core';
import { IconCheck, IconFlag, IconFlagFilled, IconLayoutSidebarRight, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader, SectionCard } from '@molecules';
import { NotesCard } from '@organisms';
import { findAssessment, formatDate, formatTime, type Result } from '../data/mock';

// remount per question so local state resets
export function QuestionPage() {
  const { id, num } = useParams();
  return <QuestionView key={`${id}-${num}`} id={id} num={Number(num)} />;
}

function QuestionView({ id, num }: { id?: string; num: number }) {
  const navigate = useNavigate();
  const found = findAssessment(id);
  const q = found?.assessment.questions.find((x) => x.num === num);

  // panel is hidden by default, per supervisor feedback
  const [panel, setPanel] = useState(false);
  const [result, setResult] = useState<Result | undefined>(q?.result);
  const [flagged, setFlagged] = useState(!!q?.flag);
  const [verified, setVerified] = useState(!!q?.verified);

  if (!found || !q) return <Text>Question not found.</Text>;
  const { patient, assessment: a } = found;
  const total = a.questions.length;
  const go = (n: number) => navigate(`/assessments/${a.id}/q/${n}`);

  return (
    <>
      <PageHeader
        title={`Question ${q.num} · ${q.task}`}
        crumbs={[
          { label: 'Patients', to: '/patients' },
          { label: patient.name, to: `/patients/${patient.id}` },
          { label: a.name, to: `/assessments/${a.id}` },
          { label: `Question ${q.num}` },
        ]}
        subtitle={`${a.name} · ${formatDate(a.date)}`}
        right={
          <Group gap="xs">
            <Button variant="default" onClick={() => navigate(`/assessments/${a.id}`)}>
              Return to assessment
            </Button>
            <Button variant="default" disabled={q.num === 1} onClick={() => go(q.num - 1)}>
              Previous
            </Button>
            <Button disabled={q.num === total} onClick={() => go(q.num + 1)}>
              Next question
            </Button>
          </Group>
        }
      />

      <Grid>
        <Grid.Col span={{ base: 12, md: panel ? 8 : 12 }}>
          <Paper bg="gray.1" withBorder p="md">
            <Group justify="space-between" mb="md">
              <Title order={5}>Question review</Title>
              <Group gap="sm">
                <Text size="sm" c="dimmed">
                  Question start {formatTime(q.start)}
                </Text>
                {flagged && (
                  <Badge color="yellow" variant="light" leftSection={<IconFlagFilled size={10} />}>
                    Flagged
                  </Badge>
                )}
                <Tooltip label={panel ? 'Hide panel' : 'Interference, verification and notes'}>
                  <ActionIcon
                    variant={panel ? 'light' : 'default'}
                    size="lg"
                    onClick={() => setPanel((p) => !p)}
                    aria-label="toggle panel"
                  >
                    <IconLayoutSidebarRight size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack>
                  <SectionCard title="Question">
                    <Text size="lg">{q.prompt}</Text>
                    <Text size="xs" c="dimmed" mt="xs">
                      {a.language} · {q.task}
                    </Text>
                  </SectionCard>
                  <SectionCard title="Answer">
                    <Text size="lg">“{q.answer}”</Text>
                    <Text size="sm" c="dimmed" mt="xs">
                      Expected: {q.target}
                    </Text>
                    <Text size="xs" c="dimmed">
                      From the transcript · answer at {formatTime(q.start + 4)}
                    </Text>
                  </SectionCard>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack>
                  <SectionCard title="Mark answer">
                    <Text size="sm" c="dimmed" mb="sm">
                      Choose an outcome for this answer
                    </Text>
                    <Group grow>
                      <Button
                        variant={result === 'correct' ? 'light' : 'default'}
                        color="green"
                        leftSection={<IconCheck size={16} />}
                        onClick={() => setResult('correct')}
                      >
                        Correct
                      </Button>
                      <Button
                        variant={result === 'incorrect' ? 'light' : 'default'}
                        color="red"
                        leftSection={<IconX size={16} />}
                        onClick={() => setResult('incorrect')}
                      >
                        Incorrect
                      </Button>
                    </Group>
                  </SectionCard>
                  <NotesCard title="Clinician notes" placeholder="Add notes for the clinician..." rows={5} />
                </Stack>
              </Grid.Col>
            </Grid>

            <Text size="xs" c="dimmed" mt="md">
              Question {q.num} of {total}
            </Text>
          </Paper>
        </Grid.Col>

        {panel && (
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper bg="gray.1" withBorder p="md" h="100%">
              <Stack>
                <SectionCard title="Interference detection">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">
                      {flagged ? `Flagged: ${q.flag ?? 'marked by clinician'}` : 'No interference flagged'}
                    </Text>
                    <ActionIcon
                      size="lg"
                      variant={flagged ? 'light' : 'default'}
                      color="yellow"
                      onClick={() => setFlagged((f) => !f)}
                      aria-label="flag interference"
                    >
                      {flagged ? <IconFlagFilled size={18} /> : <IconFlag size={18} />}
                    </ActionIcon>
                  </Group>
                </SectionCard>
                <SectionCard title="Verification">
                  <Switch
                    label={verified ? 'Verified' : 'Not verified'}
                    checked={verified}
                    onChange={(e) => setVerified(e.currentTarget.checked)}
                  />
                </SectionCard>
                <NotesCard title="Question notes" placeholder="Notes about this question" initial={q.note} rows={6} />
              </Stack>
            </Paper>
          </Grid.Col>
        )}
      </Grid>
    </>
  );
}
