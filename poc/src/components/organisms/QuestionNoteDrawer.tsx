import { Button, Checkbox, Drawer, Group, Stack, Text, Textarea } from '@mantine/core';
import { useState } from 'react';
import { formatTime, resultLabel, type Question } from '../../data/mock';

type Props = {
  question?: Question;
  note: string;
  include: boolean;
  onClose: () => void;
  onSave: (note: string, include: boolean) => void;
};

export function QuestionNoteDrawer({ question: q, ...rest }: Props) {
  return (
    <Drawer opened={!!q} onClose={rest.onClose} position="right" size={420} title={q && <Text fw={700}>Q{q.num} · {q.task}</Text>}>
      {/* remount per question so the form starts fresh */}
      {q && <NoteForm key={q.num} question={q} {...rest} />}
    </Drawer>
  );
}

function NoteForm({ question: q, note, include, onClose, onSave }: Props & { question: Question }) {
  const [text, setText] = useState(note);
  const [inReport, setInReport] = useState(include);

  return (
    <Stack>
      <Text size="xs" c="dimmed">
        Asked at {formatTime(q.start)} · {resultLabel(q)}
        {q.flag && ' · Flagged'}
      </Text>
      <div>
        <Text size="xs" c="dimmed">
          Target
        </Text>
        <Text size="sm">“{q.target}”</Text>
      </div>
      <div>
        <Text size="xs" c="dimmed">
          Child's response
        </Text>
        <Text size="sm">“{q.answer}”</Text>
      </div>
      <Textarea
        label="Question note"
        autosize
        minRows={5}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        placeholder="Add a note about this question"
      />
      <Checkbox label="Include this note in the report" checked={inReport} onChange={(e) => setInReport(e.currentTarget.checked)} />
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(text, inReport)}>Save note</Button>
      </Group>
    </Stack>
  );
}
