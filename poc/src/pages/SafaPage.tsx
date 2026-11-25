import { Button, Group, Menu, Stepper, Text } from '@mantine/core';
import { IconCheck, IconChevronDown, IconDownload } from '@tabler/icons-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageHeader } from '@molecules';
import { CompleteDialog, SafaReview, SafaSelect, SafaSpeakers, SafaTranscribe } from '@organisms';
import { chunksFor, findAssessment, segmentsFor, speakers as detected, type Role, type Segment } from '../data/mock';

const steps = ['Select', 'Transcribe', 'Speakers', 'Review', 'Complete'];

// remount per assessment so local state resets
export function SafaPage() {
  const { id } = useParams();
  return <SafaView key={id} id={id} />;
}

function SafaView({ id }: { id?: string }) {
  const navigate = useNavigate();
  const found = findAssessment(id);

  const chunks = useMemo(() => (found ? chunksFor(found.assessment) : []), [found]);
  const allSegments = useMemo(() => (found ? segmentsFor(found.assessment) : []), [found]);
  const originals = useMemo(() => Object.fromEntries(allSegments.map((s) => [s.id, s])), [allSegments]);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [roles, setRoles] = useState<Record<string, Role | undefined>>(
    Object.fromEntries(detected.map((s) => [s.id, s.role])),
  );
  const [segments, setSegments] = useState<Segment[]>([]);
  const [dialog, setDialog] = useState(false);
  const review = useRef<{ nextUnverified: () => void }>(null);

  const picked = chunks.filter((c) => selected.includes(c.id));
  const startTranscribe = () => {
    setSegments(allSegments.filter((s) => selected.includes(s.chunk)));
    setStep(1);
  };
  const doneTranscribing = useCallback(() => setStep(2), []);
  const cancelTranscribing = useCallback(() => setStep(0), []);

  if (!found) return <Text>Assessment not found.</Text>;
  const { patient, assessment: a } = found;

  return (
    <>
      <PageHeader
        title="Transcribe & annotate"
        back={{ label: 'Back to assessment', to: `/assessments/${a.id}` }}
        crumbs={[
          { label: 'Patients', to: '/patients' },
          { label: patient.name, to: `/patients/${patient.id}` },
          { label: a.name, to: `/assessments/${a.id}` },
          { label: 'SAFA' },
        ]}
        right={
          step === 3 && (
            <Group gap="sm">
              <Group gap={4} c="dimmed">
                <IconCheck size={14} />
                <Text size="xs">All changes saved</Text>
              </Group>
              <Menu position="bottom-end">
                <Menu.Target>
                  <Button variant="default" rightSection={<IconChevronDown size={14} />}>
                    Export
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {['CSV', 'TextGrid', 'JSON'].map((f) => (
                    <Menu.Item key={f} leftSection={<IconDownload size={14} />}>
                      {f}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
              <Button onClick={() => setDialog(true)}>Complete annotation</Button>
            </Group>
          )
        }
      />

      <Stepper active={step} size="sm" mb="xl" allowNextStepsSelect={false} onStepClick={setStep}>
        {steps.map((s) => (
          <Stepper.Step key={s} label={s} />
        ))}
      </Stepper>

      {step === 0 && <SafaSelect chunks={chunks} selected={selected} setSelected={setSelected} onNext={startTranscribe} />}
      {step === 1 && <SafaTranscribe chunks={picked} onDone={doneTranscribing} onCancel={cancelTranscribing} />}
      {step === 2 && (
        <SafaSpeakers
          speakers={detected.map((s) => ({ ...s, role: roles[s.id] }))}
          segments={segments}
          setRole={(sid, role) => setRoles((r) => ({ ...r, [sid]: role }))}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <SafaReview
          assessment={a}
          chunks={picked}
          segments={segments}
          setSegments={setSegments}
          speakerRoles={roles}
          originals={originals}
          ref={review}
        />
      )}

      <CompleteDialog
        opened={dialog}
        onClose={() => setDialog(false)}
        segments={segments}
        onFirstUnverified={() => {
          setDialog(false);
          review.current?.nextUnverified();
        }}
        onComplete={() => {
          setStep(4);
          navigate(`/assessments/${a.id}`);
        }}
      />
    </>
  );
}
