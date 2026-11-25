import { Anchor, Button, Group, Paper, Select, Table, Text, Title } from '@mantine/core';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import { roles, type Role, type Segment } from '../../../data/mock';

type Speaker = { id: string; role?: Role; sample: string };
type Props = {
  speakers: Speaker[];
  segments: Segment[];
  setRole: (id: string, role: Role) => void;
  onNext: () => void;
};

export function SafaSpeakers({ speakers, segments, setRole, onNext }: Props) {
  const assigned = speakers.filter((s) => s.role).length;

  return (
    <Paper withBorder p="lg" maw={900} mx="auto">
      <Title order={4}>Who is speaking?</Title>
      <Text size="sm" c="dimmed" mb="md">
        The system found {speakers.length} speakers. Pick a role for each one; it applies to all of their segments. You
        can still change a single segment while reviewing.
      </Text>

      <Table verticalSpacing="sm">
        <Table.Thead bg="gray.0">
          <Table.Tr>
            <Table.Th>Detected speaker</Table.Th>
            <Table.Th>Sample</Table.Th>
            <Table.Th>Listen</Table.Th>
            <Table.Th>Role</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {speakers.map((s) => (
            <Table.Tr key={s.id}>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {s.id}
                </Text>
                <Text size="xs" c="dimmed">
                  {(() => {
                    const n = segments.filter((x) => x.speaker === s.id).length;
                    return `${n} ${n === 1 ? 'segment' : 'segments'}`;
                  })()}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">“{s.sample}”</Text>
              </Table.Td>
              <Table.Td>
                <Button size="xs" variant="default" leftSection={<IconPlayerPlayFilled size={12} />}>
                  Play
                </Button>
              </Table.Td>
              <Table.Td w={200}>
                <Select
                  size="xs"
                  placeholder="Select a role"
                  data={roles}
                  value={s.role ?? null}
                  onChange={(v) => v && setRole(s.id, v as Role)}
                  allowDeselect={false}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="space-between" mt="lg">
        <Text size="sm" fw={600}>
          {assigned} of {speakers.length} speakers assigned
        </Text>
        <Group>
          <Anchor size="sm" c="dimmed" onClick={onNext}>
            Skip for now
          </Anchor>
          <Button onClick={onNext}>Continue to review</Button>
        </Group>
      </Group>
    </Paper>
  );
}
