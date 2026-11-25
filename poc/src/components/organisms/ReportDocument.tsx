import {
  ActionIcon, Anchor, Badge, Box, CloseButton, Divider, Group, Paper, Select, SimpleGrid, Stack, Table, Text, Textarea, TextInput, Title,
} from '@mantine/core';
import { IconFlagFilled, IconNote, IconPlus } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { StatusBadge } from '@atoms';
import { ReportSection } from '@molecules';
import { clinician, domains, formatDate, resultColor, type Assessment, type Patient, type Question, type Result } from '../../data/mock';

export type ReportDraft = {
  summary: string;
  fluency: string;
  recommendations: string;
  responses: Record<number, string>;
  results: Record<number, Result>;
  notes: Record<number, string>;
  include: Record<number, boolean>;
  flags: number[];
};

type Props = {
  patient: Patient;
  assessment: Assessment;
  draft: ReportDraft;
  editing: boolean;
  set: (patch: Partial<ReportDraft>) => void;
  onNote: (q: Question) => void;
};

const resultText = { correct: 'Correct', incorrect: 'Incorrect', manual: 'Not evaluated' };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={600} component="div">
        {children}
      </Text>
    </div>
  );
}

// the report itself, sections follow the figma report document
export function ReportDocument({ patient: p, assessment: a, draft: d, editing, set, onNote }: Props) {
  const resultOf = (q: Question) => d.results[q.num] ?? q.result;
  const correct = a.questions.filter((q) => resultOf(q) === 'correct').length;

  // score per clinical domain from the current results
  const domainScore = (name: string) => {
    const qs = a.questions.filter((q) => q.domain === name);
    return qs.length ? `${qs.filter((q) => resultOf(q) === 'correct').length} / ${qs.length}` : '— / —';
  };
  const pairs = [0, 2, 4].map((i) => [domains[i], domains[i + 1]]);
  const grouped = domains
    .map((name) => ({ name, qs: a.questions.filter((q) => q.domain === name) }))
    .filter((g) => g.qs.length);

  return (
    <Paper withBorder p="xl" maw={960} mx="auto">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Assessment report · {p.name}</Title>
        <Badge variant="outline" color="gray">
          Confidential
        </Badge>
      </Group>

      <Stack gap="lg">
        {/* read-only even while editing, comes from the patient record */}
        <ReportSection num={1} title="Patient background info" color="blue">
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
            <Field label="Child">{p.name}</Field>
            <Field label="Age">{p.age} y</Field>
            <Field label="Gender">{p.gender}</Field>
            <Field label="Languages spoken at home">{p.languages.join(', ')}</Field>
            <Field label="Date & time">
              {formatDate(a.date)} · {a.time}
            </Field>
            <Field label="Assessment type">{a.name}</Field>
            <Field label="Language">{a.language}</Field>
            <Field label="Clinician">{clinician}</Field>
          </SimpleGrid>
        </ReportSection>

        <ReportSection num={2} title="Assessment findings" color="cyan" editing={editing}>
          <Text size="sm" mb="sm">
            <Text span fw={700}>
              Overall score:
            </Text>{' '}
            {correct} / {a.maxScore} ({Math.round((correct / a.maxScore) * 100)}%)
          </Text>
          <Table withTableBorder withColumnBorders>
            <Table.Thead bg="cyan.0">
              <Table.Tr>
                <Table.Th>Clinical domain</Table.Th>
                <Table.Th>Score</Table.Th>
                <Table.Th>Clinical domain</Table.Th>
                <Table.Th>Score</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {pairs.map(([x, y]) => (
                <Table.Tr key={x}>
                  <Table.Td fw={600}>{x}</Table.Td>
                  <Table.Td>{domainScore(x)}</Table.Td>
                  <Table.Td fw={600}>{y}</Table.Td>
                  <Table.Td>{domainScore(y)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {editing ? (
            <Textarea
              mt="sm"
              label="Summary"
              autosize
              minRows={2}
              value={d.summary}
              onChange={(e) => set({ summary: e.currentTarget.value })}
            />
          ) : (
            d.summary && (
              <Text size="sm" mt="sm">
                {d.summary}
              </Text>
            )
          )}
        </ReportSection>

        {/* grouped by area, response under each question (supervisor feedback) */}
        <ReportSection num={3} title="Questions and responses" color="grape" editing={editing}>
          <Stack gap="lg">
            {grouped.map((g) => (
              <div key={g.name}>
                <Divider label={<Text size="sm" fw={700} c="grape.8">{g.name}</Text>} labelPosition="left" mb="xs" />
                <Stack gap="sm">
                  {g.qs.map((q) => {
                    const r = resultOf(q);
                    const note = d.notes[q.num] ?? q.note;
                    return (
                      <Box key={q.num}>
                        <Group justify="space-between" wrap="nowrap" mb={4}>
                          <Text size="sm" fw={600}>
                            Q{q.num} · {q.prompt}
                          </Text>
                          <Group gap="xs" wrap="nowrap">
                            {editing ? (
                              <Select
                                size="xs"
                                w={140}
                                value={r}
                                allowDeselect={false}
                                onChange={(v) => v && set({ results: { ...d.results, [q.num]: v as Result } })}
                                data={Object.entries(resultText).map(([value, label]) => ({ value, label }))}
                              />
                            ) : (
                              <StatusBadge
                                label={`${resultText[r]}${q.manual ? ' (manual)' : ''}`}
                                color={resultColor(r)}
                              />
                            )}
                            <ActionIcon
                              variant={note ? 'light' : 'subtle'}
                              color={note ? 'grape' : 'gray'}
                              onClick={() => onNote(q)}
                              aria-label="question note"
                            >
                              {note ? <IconNote size={16} /> : <IconPlus size={16} />}
                            </ActionIcon>
                          </Group>
                        </Group>
                        {editing ? (
                          <TextInput
                            size="xs"
                            value={d.responses[q.num] ?? q.answer}
                            onChange={(e) => set({ responses: { ...d.responses, [q.num]: e.currentTarget.value } })}
                          />
                        ) : (
                          <Paper withBorder bg="gray.0" px="sm" py={6} style={{ borderColor: 'var(--mantine-color-gray-3)' }}>
                            <Text size="sm">“{d.responses[q.num] ?? q.answer}”</Text>
                          </Paper>
                        )}
                        {note && d.include[q.num] !== false && (
                          <Text size="xs" c="dimmed" mt={4}>
                            Note: {note}
                          </Text>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </div>
            ))}
          </Stack>
        </ReportSection>

        <ReportSection num={4} title="Flagged items" color="yellow" editing={editing}>
          {d.flags.length === 0 ? (
            <Text size="sm" c="dimmed">
              No flagged items.
            </Text>
          ) : (
            <Stack gap={6}>
              {d.flags.map((n) => {
                const q = a.questions[n - 1];
                return (
                  <Group key={n} gap="xs" wrap="nowrap">
                    <IconFlagFilled size={14} color="var(--mantine-color-yellow-7)" />
                    <Text size="sm" style={{ flex: 1 }}>
                      Q{q.num} · {q.task}: {q.flag}
                    </Text>
                    {editing && (
                      <CloseButton size="sm" onClick={() => set({ flags: d.flags.filter((x) => x !== n) })} aria-label="remove" />
                    )}
                  </Group>
                );
              })}
            </Stack>
          )}
        </ReportSection>

        <ReportSection
          num={5}
          title="Fluency (stuttering)"
          color="teal"
          editing={editing}
          right={
            <Anchor component={Link} to={`/assessments/${a.id}/safa`} size="xs">
              View full transcript ›
            </Anchor>
          }
        >
          <FreeText
            editing={editing}
            value={d.fluency}
            onChange={(v) => set({ fluency: v })}
            placeholder="Clinician notes on the child's fluency in each language, based on the answers and transcript."
          />
        </ReportSection>

        <ReportSection num={6} title="Recommendations / plan" color="indigo" editing={editing}>
          <FreeText
            editing={editing}
            value={d.recommendations}
            onChange={(v) => set({ recommendations: v })}
            placeholder="Clinician fills this in."
          />
        </ReportSection>
      </Stack>
    </Paper>
  );
}

// textarea while editing, plain text otherwise
function FreeText({ editing, value, onChange, placeholder }: { editing: boolean; value: string; onChange: (v: string) => void; placeholder: string }) {
  if (editing) {
    return <Textarea autosize minRows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.currentTarget.value)} />;
  }
  return (
    <Text size="sm" c={value ? undefined : 'dimmed'} fs={value ? undefined : 'italic'}>
      {value || placeholder}
    </Text>
  );
}
