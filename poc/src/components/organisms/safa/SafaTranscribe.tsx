import { Button, Group, Loader, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { formatTime, type Chunk } from '../../../data/mock';

type Props = { chunks: Chunk[]; onDone: () => void; onCancel: () => void };

// fake progress, a couple of seconds per chunk
export function SafaTranscribe({ chunks, onDone, onCancel }: Props) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= chunks.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), 2000);
    return () => clearTimeout(t);
  }, [done, chunks.length, onDone]);

  const current = Math.min(done + 1, chunks.length);

  return (
    <Paper withBorder p="lg" maw={760} mx="auto">
      <Title order={4}>
        Transcribing {current} of {chunks.length} {chunks.length === 1 ? 'chunk' : 'chunks'}...
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Creating the transcript with timestamps, speaker and language labels.
      </Text>
      <Progress value={((done + 0.5) / chunks.length) * 100} animated mb="md" />

      <Stack gap={0}>
        {chunks.map((c, i) => (
          <Group key={c.id} justify="space-between" py="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
            <Text size="sm" fw={600} c={i > done ? 'dimmed' : undefined}>
              Chunk {c.id}{' '}
              <Text span size="xs" c="dimmed" fw={400}>
                · {c.tasks.length} tasks · {c.language}
              </Text>
            </Text>
            <Group gap="lg">
              <Text size="xs" c="dimmed">
                {formatTime(c.start)} – {formatTime(c.end)}
              </Text>
              {i < done ? (
                <Group gap={4} c="cyan.7">
                  <IconCheck size={14} />
                  <Text size="xs">Done</Text>
                </Group>
              ) : i === done ? (
                <Group gap={6}>
                  <Loader size={12} />
                  <Text size="xs" fw={600}>
                    In progress
                  </Text>
                </Group>
              ) : (
                <Text size="xs" c="dimmed">
                  Waiting
                </Text>
              )}
            </Group>
          </Group>
        ))}
      </Stack>

      <Group justify="space-between" mt="xl">
        <Text size="xs" c="dimmed">
          You'll go to the next step automatically when it's done.
        </Text>
        <Button variant="default" onClick={onCancel}>
          Cancel transcription
        </Button>
      </Group>
    </Paper>
  );
}
