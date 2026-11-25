import { ActionIcon, AspectRatio, Center, Group, Paper, Select, Slider, Stack, Text } from '@mantine/core';
import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconVolume } from '@tabler/icons-react';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { formatTime } from '../../data/mock';

type Props = {
  duration: number;
  time: number;
  setTime: Dispatch<SetStateAction<number>>;
  markers?: number[]; // question starts
  label?: string;
  speed?: boolean; // show playback speed
};

// placeholder video with working fake playback
export function RecordingPlayer({ duration, time, setTime, markers = [], label, speed }: Props) {
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState('1');

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => Math.min(duration, t + Number(rate))), 1000);
    return () => clearInterval(id);
  }, [playing, rate, duration, setTime]);

  const Play = playing ? IconPlayerPauseFilled : IconPlayerPlayFilled;

  return (
    <Stack gap="sm">
      <Paper withBorder bg="gray.2" style={{ overflow: 'hidden' }}>
        <AspectRatio ratio={16 / 9}>
          <Center pos="relative">
            {label && (
              <Text size="xs" c="dimmed" pos="absolute" top={10} left={12}>
                {label}
              </Text>
            )}
            <ActionIcon size={56} radius="xl" variant="white" color="gray" onClick={() => setPlaying((p) => !p)} aria-label="play">
              <Play size={24} />
            </ActionIcon>
          </Center>
        </AspectRatio>
      </Paper>

      <Paper withBorder p="sm">
        <Group gap="sm" wrap="nowrap">
          <ActionIcon variant="subtle" color="gray" onClick={() => setPlaying((p) => !p)} aria-label="play">
            <Play size={16} />
          </ActionIcon>
          {speed && (
            <Select
              size="xs"
              w={70}
              value={rate}
              onChange={(v) => setRate(v ?? '1')}
              data={['0.5', '1', '1.5', '2'].map((v) => ({ value: v, label: `${v}x` }))}
              allowDeselect={false}
            />
          )}
          <Slider
            style={{ flex: 1 }}
            min={0}
            max={duration}
            value={time}
            onChange={setTime}
            label={formatTime}
            marks={markers.map((m) => ({ value: m }))}
            size="sm"
          />
          <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
            {formatTime(time)} / {formatTime(duration)}
          </Text>
          {speed && <IconVolume size={16} color="var(--mantine-color-gray-6)" />}
        </Group>
      </Paper>
    </Stack>
  );
}
