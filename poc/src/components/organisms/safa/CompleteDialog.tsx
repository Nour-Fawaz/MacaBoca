import { Alert, Button, Group, Modal, Progress, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import type { Segment } from '../../../data/mock';

type Props = { opened: boolean; onClose: () => void; segments: Segment[]; onFirstUnverified: () => void; onComplete: () => void };

export function CompleteDialog({ opened, onClose, segments, onFirstUnverified, onComplete }: Props) {
  const verified = segments.filter((s) => s.verified).length;
  const left = segments.filter((s) => !s.verified);

  // unverified count per chunk
  const byChunk = Object.entries(
    left.reduce<Record<number, number>>((acc, s) => ({ ...acc, [s.chunk]: (acc[s.chunk] ?? 0) + 1 }), {}),
  );

  return (
    <Modal opened={opened} onClose={onClose} title={<Text fw={700} size="lg">Complete annotation?</Text>} centered size="lg">
      <Text fw={600} mb={6}>
        {verified} of {segments.length} segments verified
      </Text>
      <Progress value={(verified / Math.max(1, segments.length)) * 100} mb="sm" />
      {left.length > 0 && (
        <Text size="sm" c="dimmed" mb="md">
          {left.length} segments still need review: {byChunk.map(([c, n]) => `Chunk ${c} (${n})`).join(' · ')}
        </Text>
      )}
      <Alert variant="light" color="gray" icon={<IconInfoCircle size={16} />} mb="lg">
        The annotated transcript is saved to the assessment record. It is then mapped to the child's responses to
        generate the scores. Unverified segments are saved and marked as unverified.
      </Alert>
      <Group justify="flex-end">
        {left.length > 0 && (
          <Button variant="default" onClick={onFirstUnverified}>
            Go to first unverified
          </Button>
        )}
        <Button onClick={onComplete}>Complete & return to assessment</Button>
      </Group>
    </Modal>
  );
}
