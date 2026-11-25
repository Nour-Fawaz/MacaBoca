import { Anchor, Group, ScrollArea, Table, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { IconCheck, IconFlag, IconMinus, IconPlayerPlayFilled, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { StatusBadge } from '@atoms';
import { SectionCard } from '@molecules';
import { formatTime, resultColor, type Assessment } from '../../data/mock';

type Props = { assessment: Assessment; onSeek: (sec: number) => void };

const resultIcon = { correct: IconCheck, incorrect: IconX, manual: IconMinus };

// every question with its result, timestamp and status
export function QuestionList({ assessment: a, onSeek }: Props) {
  const navigate = useNavigate();

  return (
    <SectionCard title={`Questions (${a.questions.length})`}>
      <ScrollArea h={420} offsetScrollbars>
        <Table highlightOnHover verticalSpacing="xs">
          <Table.Tbody>
            {a.questions.map((q) => {
              const Icon = resultIcon[q.result];
              return (
                <Table.Tr
                  key={q.num}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/assessments/${a.id}/q/${q.num}`)}
                >
                  <Table.Td w={36}>
                    <ThemeIcon size="sm" variant="light" color={resultColor(q.result)}>
                      <Icon size={12} />
                    </ThemeIcon>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" wrap="nowrap">
                      <Text fw={600} size="sm">
                        Q{q.num}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {q.task}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {/* jump the player without opening the question */}
                    <Anchor
                      size="xs"
                      c="dimmed"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSeek(q.start);
                      }}
                    >
                      <Group gap={4} wrap="nowrap">
                        <IconPlayerPlayFilled size={10} />
                        {formatTime(q.start)}
                      </Group>
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge label={q.verified ? 'Verified' : 'Unverified'} color={q.verified ? 'cyan' : 'gray'} />
                  </Table.Td>
                  <Table.Td w={30}>
                    {q.flag && (
                      <Tooltip label={`Flagged: ${q.flag}`}>
                        <IconFlag size={16} color="var(--mantine-color-yellow-7)" />
                      </Tooltip>
                    )}
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </SectionCard>
  );
}
