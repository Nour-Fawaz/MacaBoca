import { Badge, Button, Group, Text } from '@mantine/core';
import { IconDownload, IconPencil } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { PageHeader } from '@molecules';
import { QuestionNoteDrawer, ReportDocument, type ReportDraft } from '@organisms';
import { findAssessment, reportFor, type Question } from '../data/mock';

const now = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export function ReportPage() {
  const { id } = useParams();
  return <ReportView key={id} id={id} />;
}

function ReportView({ id }: { id?: string }) {
  const found = findAssessment(id);
  const report = found && reportFor(found.patient, found.assessment);

  const [saved, setSaved] = useState<ReportDraft>(() => ({
    summary: '',
    fluency: report?.fluency ?? '',
    recommendations: report?.recommendations ?? '',
    responses: {},
    results: {},
    notes: {},
    include: {},
    flags: found?.assessment.questions.filter((q) => q.flag).map((q) => q.num) ?? [],
  }));
  const [draft, setDraft] = useState(saved);
  const [editing, setEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState('2:45 PM');
  const [noteFor, setNoteFor] = useState<Question>();

  if (!found || !report) return <Text>Report not found.</Text>;
  const { patient, assessment: a } = found;

  const save = () => {
    setSaved(draft);
    setEditing(false);
    setLastSaved(now());
  };
  const cancel = () => {
    setDraft(saved);
    setEditing(false);
  };

  return (
    <>
      <PageHeader
        title="Assessment report"
        back={{ label: 'Back to assessment', to: `/assessments/${a.id}` }}
        crumbs={[
          { label: 'Patients', to: '/patients' },
          { label: patient.name, to: `/patients/${patient.id}` },
          { label: a.name, to: `/assessments/${a.id}` },
          { label: 'Report' },
        ]}
        titleRight={
          <Group gap="xs">
            <Badge variant="light" color={editing ? 'yellow' : report.status === 'Final' ? 'cyan' : 'gray'} tt="none">
              {editing ? 'Editing' : report.status}
            </Badge>
            <Text size="sm" c="dimmed">
              {editing ? 'Unsaved changes' : `Last saved ${lastSaved}`}
            </Text>
          </Group>
        }
        right={
          <Group gap="xs">
            {editing ? (
              <>
                <Button variant="default" onClick={cancel}>
                  Cancel
                </Button>
                <Button onClick={save}>Save</Button>
              </>
            ) : (
              <Button variant="default" leftSection={<IconPencil size={16} />} onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
            {/* no pdf export yet */}
            <Button variant={editing ? 'default' : 'filled'} leftSection={<IconDownload size={16} />}>
              Download
            </Button>
          </Group>
        }
      />

      <ReportDocument
        patient={patient}
        assessment={a}
        draft={draft}
        editing={editing}
        set={(patch) => setDraft((d) => ({ ...d, ...patch }))}
        onNote={setNoteFor}
      />

      <QuestionNoteDrawer
        question={noteFor}
        note={noteFor ? (draft.notes[noteFor.num] ?? noteFor.note) : ''}
        include={noteFor ? draft.include[noteFor.num] !== false : true}
        onClose={() => setNoteFor(undefined)}
        onSave={(note, include) => {
          // notes save right away, even outside edit mode
          const n = noteFor!.num;
          const apply = (d: ReportDraft) => ({ ...d, notes: { ...d.notes, [n]: note }, include: { ...d.include, [n]: include } });
          setDraft(apply);
          setSaved(apply);
          setNoteFor(undefined);
        }}
      />
    </>
  );
}
