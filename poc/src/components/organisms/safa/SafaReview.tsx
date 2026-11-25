import { Badge, Button, Divider, Grid, Group, Paper, Progress, SegmentedControl, Select, Stack, Table, Text } from '@mantine/core';
import { IconCheck, IconPencil } from '@tabler/icons-react';
import { Fragment, useImperativeHandle, useMemo, useState, type Ref, type Dispatch, type SetStateAction } from 'react';
import { formatTime, type Assessment, type Chunk, type Role, type Segment } from '../../../data/mock';
import { NotesCard } from '../NotesCard';
import { RecordingPlayer } from '../RecordingPlayer';
import { SegmentEditor } from './SegmentEditor';

type Props = {
  assessment: Assessment;
  chunks: Chunk[];
  segments: Segment[];
  setSegments: Dispatch<SetStateAction<Segment[]>>;
  speakerRoles: Record<string, Role | undefined>;
  originals: Record<string, Segment>;
  ref?: Ref<{ nextUnverified: () => void }>; // lets the complete dialog jump here
};

type Filter = 'review' | 'edited' | 'verified' | 'all';

export function SafaReview({ assessment: a, chunks, segments, setSegments, speakerRoles, originals, ref }: Props) {
  const [time, setTime] = useState(chunks[0]?.start ?? 0);
  const [filter, setFilter] = useState<Filter>('all');
  const [speaker, setSpeaker] = useState('all');
  const [open, setOpen] = useState<string | null>(null);

  const roleOf = (s: Segment) => s.role ?? speakerRoles[s.speaker];
  const edited = (s: Segment) => s.text !== s.original;
  const update = (id: string, patch: Partial<Segment>) =>
    setSegments((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const counts = {
    review: segments.filter((s) => !s.verified).length,
    edited: segments.filter(edited).length,
    verified: segments.filter((s) => s.verified).length,
    all: segments.length,
  };

  const shown = segments.filter(
    (s) =>
      (filter === 'all' ||
        (filter === 'review' && !s.verified) ||
        (filter === 'edited' && edited(s)) ||
        (filter === 'verified' && s.verified)) &&
      (speaker === 'all' || roleOf(s) === speaker),
  );

  // segment under the playhead
  const playing = useMemo(
    () => [...segments].sort((x, y) => x.start - y.start).filter((s) => s.start <= time).at(-1)?.id,
    [segments, time],
  );

  const nextUnverified = () => {
    const s = segments.find((x) => !x.verified);
    if (!s) return;
    setFilter('all');
    setOpen(s.id);
    setTime(s.start);
    setTimeout(() => document.getElementById(`seg-${s.id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
  };

  useImperativeHandle(ref, () => ({ nextUnverified }));

  const taskOf = (s: Segment) => a.questions.find((q) => `${q.num}` === s.id.split('-')[0]);

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack style={{ position: 'sticky', top: 16 }}>
          <RecordingPlayer
            duration={a.duration}
            time={time}
            setTime={setTime}
            markers={chunks.map((c) => c.start)}
            label={`Chunk ${chunks.find((c) => time >= c.start && time < c.end)?.id ?? 1}`}
            speed
          />
          <Paper withBorder p="md">
            <Group justify="space-between" mb={6}>
              <Text size="sm" fw={600}>
                Review progress
              </Text>
              <Text size="sm" fw={700}>
                {counts.verified} / {counts.all} verified
              </Text>
            </Group>
            <Progress value={(counts.verified / Math.max(1, counts.all)) * 100} mb={6} />
            <Text size="xs" c="dimmed">
              {counts.review} need review · {counts.edited} edited · {chunks.length} chunks
            </Text>
          </Paper>
          <NotesCard title="Assessment notes" placeholder="Notes about the whole session..." initial={a.notes} />
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8 }}>
        <Group justify="space-between" mb="sm">
          <SegmentedControl
            size="xs"
            value={filter}
            onChange={(v) => setFilter(v as Filter)}
            data={[
              { value: 'review', label: `Needs review (${counts.review})` },
              { value: 'edited', label: `Edited (${counts.edited})` },
              { value: 'verified', label: `Verified (${counts.verified})` },
              { value: 'all', label: `All (${counts.all})` },
            ]}
          />
          <Group gap="xs">
            <Select
              size="xs"
              w={160}
              value={speaker}
              onChange={(v) => setSpeaker(v ?? 'all')}
              allowDeselect={false}
              data={[
                { value: 'all', label: 'Speaker: All' },
                ...['Experimenter', 'Child', 'Parent'].map((r) => ({ value: r, label: `Speaker: ${r}` })),
              ]}
            />
            <Button size="xs" variant="default" onClick={nextUnverified} disabled={counts.review === 0}>
              Next unverified
            </Button>
          </Group>
        </Group>

        <Stack>
          {chunks.map((c) => {
            const inChunk = segments.filter((s) => s.chunk === c.id);
            const rows = shown.filter((s) => s.chunk === c.id);
            let lastTask = '';
            return (
              <Paper key={c.id} withBorder style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md" py="sm" bg="gray.0" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
                  <Group gap="xs">
                    <Text fw={600} size="sm">
                      Chunk {c.id} · {formatTime(c.start)} – {formatTime(c.end)}
                    </Text>
                    <Badge size="sm" variant="light" tt="none">
                      {c.language}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {inChunk.filter((s) => s.verified).length} / {inChunk.length} verified
                  </Text>
                </Group>

                {rows.length === 0 ? (
                  <Text size="sm" c="dimmed" p="md">
                    Nothing matches this filter.
                  </Text>
                ) : (
                  <Table verticalSpacing={6} highlightOnHover>
                    <Table.Tbody>
                      {rows.map((s) => {
                        // label each new task inside the chunk
                        const q = taskOf(s);
                        const header = q && q.task !== lastTask ? q : undefined;
                        if (q) lastTask = q.task;
                        const isOpen = open === s.id;
                        return (
                          <Fragment key={s.id}>
                            {header && (
                              <Table.Tr>
                                <Table.Td colSpan={4} py={4}>
                                  <Divider label={`${header.task} · ${formatTime(header.start)}`} labelPosition="left" />
                                </Table.Td>
                              </Table.Tr>
                            )}
                            {isOpen ? (
                              <Table.Tr id={`seg-${s.id}`}>
                                <Table.Td colSpan={4} p="xs">
                                  <SegmentEditor
                                    segment={s}
                                    role={roleOf(s)}
                                    original={{ start: originals[s.id].start, role: speakerRoles[s.speaker] }}
                                    update={(patch) => update(s.id, patch)}
                                    onReplay={() => setTime(s.start)}
                                    onVerify={() => {
                                      update(s.id, { verified: true });
                                      setOpen(null);
                                    }}
                                  />
                                </Table.Td>
                              </Table.Tr>
                            ) : (
                              <Table.Tr
                                id={`seg-${s.id}`}
                                onClick={() => {
                                  setOpen(s.id);
                                  setTime(s.start);
                                }}
                                bg={playing === s.id ? 'cyan.0' : undefined}
                                style={{ cursor: 'pointer' }}
                              >
                                <Table.Td w={60}>
                                  <Text size="xs" c="dimmed">
                                    {formatTime(s.start)}
                                  </Text>
                                </Table.Td>
                                <Table.Td w={120}>
                                  <Text size="xs" fw={700} tt="uppercase" c={roleOf(s) ? undefined : 'dimmed'}>
                                    {roleOf(s) ?? s.speaker}
                                  </Text>
                                </Table.Td>
                                <Table.Td>
                                  <Text size="sm">{s.text}</Text>
                                </Table.Td>
                                <Table.Td w={150} ta="right">
                                  <SegmentStatus segment={s} edited={edited(s)} />
                                </Table.Td>
                              </Table.Tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                )}
              </Paper>
            );
          })}
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

function SegmentStatus({ segment: s, edited }: { segment: Segment; edited: boolean }) {
  return (
    <Group gap={6} justify="flex-end" wrap="nowrap">
      {edited && (
        <Group gap={2} c="dimmed">
          <IconPencil size={12} />
          <Text size="xs">Edited</Text>
        </Group>
      )}
      {s.verified ? (
        <Group gap={2} c="cyan.7">
          <IconCheck size={12} />
          <Text size="xs">Verified</Text>
        </Group>
      ) : (
        <Text size="xs" c="yellow.8">
          {s.lowConfidence ? 'Low confidence' : 'Unverified'}
        </Text>
      )}
    </Group>
  );
}
