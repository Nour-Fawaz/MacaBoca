import { Button, Group, Stack, Text, Textarea } from '@mantine/core';
import { useState } from 'react';
import { SectionCard } from '@molecules';

type Props = { title: string; placeholder: string; initial?: string; rows?: number };

// notes box with a save button, only saves locally
export function NotesCard({ title, placeholder, initial = '', rows = 3 }: Props) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const dirty = text !== saved;

  return (
    <SectionCard title={title}>
      <Stack gap="sm">
        <Textarea
          placeholder={placeholder}
          autosize
          minRows={rows}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <Group justify="flex-end" gap="sm">
          {!dirty && saved && (
            <Text size="xs" c="dimmed">
              Saved
            </Text>
          )}
          <Button size="xs" variant="default" disabled={!dirty} onClick={() => setSaved(text)}>
            Save
          </Button>
        </Group>
      </Stack>
    </SectionCard>
  );
}
