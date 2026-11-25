import { Avatar } from '@mantine/core';
import { WarningChip } from '@atoms';
import { formatDate, type Patient } from '../../data/mock';
import { RowCard } from './RowCard';

type Props = { patient: Patient; onClick: () => void };

export function PatientRow({ patient, onClick }: Props) {
  const toReview = patient.assessments.filter((a) => !a.reviewed).length;
  const last = patient.assessments[0];
  const initials = patient.name
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <RowCard
      onClick={onClick}
      left={
        <Avatar radius="md" size="md" color="cyan">
          {initials}
        </Avatar>
      }
      title={patient.name}
      meta={patient.id}
      subtitle={`Age ${patient.age} · ${patient.languages.join(', ')} · Last assessment ${last ? formatDate(last.date) : 'none'}`}
      right={
        // only flag patients with assessments left to review
        toReview > 0 && <WarningChip label={`${toReview} not reviewed`} />
      }
    />
  );
}
