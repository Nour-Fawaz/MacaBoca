import { Anchor, Button, Group, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { IconCheck, IconPlayerPlayFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { formatTime, roles, type Role, type Segment } from '../../../data/mock';

type Props = {
  segment: Segment;
  role?: Role;
  original: { start: number; role?: Role };
  update: (patch: Partial<Segment>) => void;
  onReplay: () => void;
  onVerify: () => void;
};

const toSeconds = (v: string) => {
  const [m, s] = v.split(':').map(Number);
  return Number.isFinite(m) && Number.isFinite(s) ? m * 60 + s : undefined;
};

// every field is editable (supervisor feedback)
export function SegmentEditor({ segment: s, role, original, update, onReplay, onVerify }: Props) {
  const [onset, setOnset] = useState(formatTime(s.start));
  const changed = s.text !== s.original;

  return (
    <Paper withBorder p="md" style={{ borderColor: 'var(--mantine-color-cyan-3)' }}>
      <Stack gap="sm">
        <TextInput value={s.text} onChange={(e) => update({ text: e.currentTarget.value })} size="md" data-autofocus />
        <Group align="flex-end" gap="sm">
          <TextInput
            label="Onset"
            size="xs"
            w={80}
            value={onset}
            onChange={(e) => setOnset(e.currentTarget.value)}
            onBlur={() => {
              const sec = toSeconds(onset);
              if (sec !== undefined) update({ start: sec });
              else setOnset(formatTime(s.start));
            }}
          />
          <Select
            label="Speaker"
            size="xs"
            w={170}
            data={roles}
            value={role ?? null}
            placeholder={s.speaker}
            onChange={(v) => v && update({ role: v as Role })}
            allowDeselect={false}
            comboboxProps={{ withinPortal: true }}
          />
          <Select
            label="Language"
            size="xs"
            w={120}
            data={['English', 'Mandarin']}
            value={s.language}
            onChange={(v) => v && update({ language: v })}
            allowDeselect={false}
          />
          <Group gap="xs" ml="auto">
            <Anchor size="xs" onClick={() => update({ text: s.original, start: original.start, role: original.role })}>
              Revert to original
            </Anchor>
            <Button size="xs" variant="default" leftSection={<IconPlayerPlayFilled size={12} />} onClick={onReplay}>
              Replay
            </Button>
            <Button size="xs" leftSection={<IconCheck size={14} />} onClick={onVerify}>
              Verify
            </Button>
          </Group>
        </Group>
        <Text size="xs" c="dimmed">
          Speaker changes apply to this segment only. Use the Speakers step to change all.
        </Text>
        <Text size="xs" c="dimmed">
          Original (AI, read-only): “{s.original}” · {formatTime(original.start)} · {s.speaker} · {s.language}
          {changed && <Text span size="xs" fw={600} c="dark"> · Edited</Text>}
        </Text>
      </Stack>
    </Paper>
  );
}
