import { LineChart } from '@mantine/charts';
import { Text } from '@mantine/core';
import { SectionCard } from '@molecules';
import { type Assessment } from '../../data/mock';

type Props = { assessments: Assessment[] };

const short = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

export function ScoreChart({ assessments }: Props) {
  const max = assessments[0]?.maxScore ?? 24;
  // oldest first so the line reads left to right
  const data = [...assessments]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((a) => ({ date: short(a.date), score: a.score }));

  return (
    <SectionCard title="Overall score over time">
      {data.length < 2 ? (
        <Text size="sm" c="dimmed">
          Not enough assessments to show a trend yet.
        </Text>
      ) : (
        <LineChart
          h={220}
          data={data}
          dataKey="date"
          series={[{ name: 'score', label: 'Score', color: 'cyan.6' }]}
          curveType="monotone"
          gridAxis="x"
          tickLine="none"
          strokeWidth={2}
          yAxisProps={{ domain: [0, max], ticks: [0, max / 4, max / 2, (3 * max) / 4, max], width: 30 }}
          xAxisProps={{ padding: { left: 16, right: 16 } }}
        />
      )}
    </SectionCard>
  );
}
