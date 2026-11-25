import { Badge, Button, Checkbox, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { formatTime, type Chunk } from '../../../data/mock';

type Props = { chunks: Chunk[]; selected: number[]; setSelected: (ids: number[]) => void; onNext: () => void };

// pick ~20 min chunks instead of questions (supervisor feedback)
export function SafaSelect({ chunks, selected, setSelected, onNext }: Props) {
  const all = selected.length === chunks.length;
  const total = chunks.reduce((s, c) => s + c.end - c.start, 0);
  const minutes = Math.round(
    chunks.filter((c) => selected.includes(c.id)).reduce((s, c) => s + c.end - c.start, 0) / 60,
  );
  const toggle = (id: number) =>
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <Paper withBorder p="lg" maw={760} mx="auto">
      <Title order={4}>Choose what to open in SAFA</Title>
      <Text size="sm" c="dimmed" mb="md">
        Select the time chunks of the recording to transcribe and annotate, or the full assessment.
      </Text>

      <Paper bg="gray.0" withBorder p="sm" mb="sm" style={{ borderColor: 'var(--mantine-color-gray-2)' }}>
        <Checkbox
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onChange={() => setSelected(all ? [] : chunks.map((c) => c.id))}
          label={
            <Group gap="xs">
              <Text size="sm" fw={600}>
                Select full assessment
              </Text>
              <Text size="xs" c="dimmed">
                {chunks.length} chunks · {formatTime(total)} of recording
              </Text>
            </Group>
          }
        />
      </Paper>

      <Stack gap="xs">
        {chunks.map((c) => {
          const flagged = c.questions.filter((q) => q.flag).length;
          const manual = c.questions.filter((q) => q.result === 'manual').length;
          return (
            <Paper key={c.id} withBorder p="sm">
              <Group align="flex-start" wrap="nowrap">
                <Checkbox mt={2} checked={selected.includes(c.id)} onChange={() => toggle(c.id)} aria-label={`chunk ${c.id}`} />
                <Stack gap={6} style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Text size="sm" fw={600}>
                        Chunk {c.id}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {formatTime(c.start)} – {formatTime(c.end)}
                      </Text>
                      <Badge size="sm" variant="light" tt="none">
                        {c.language}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      {c.questions.length} questions
                      {flagged > 0 && ` · ${flagged} flagged`}
                      {manual > 0 && ` · ${manual} need manual evaluation`}
                    </Text>
                  </Group>
                  {/* tasks inside the chunk */}
                  <Group gap={6}>
                    {c.tasks.map((t) => (
                      <Badge key={t} size="sm" variant="outline" color="gray" tt="none" fw={500}>
                        {t}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Group>
            </Paper>
          );
        })}
      </Stack>

      <Group justify="space-between" mt="lg">
        <Text size="sm" fw={600}>
          {selected.length} {selected.length === 1 ? 'chunk' : 'chunks'} selected · about {minutes} min of recording
        </Text>
        <Button disabled={selected.length === 0} onClick={onNext}>
          Transcribe selected
        </Button>
      </Group>
    </Paper>
  );
}
