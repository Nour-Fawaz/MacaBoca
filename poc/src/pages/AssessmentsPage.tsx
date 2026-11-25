import { PageHeader } from '@molecules';
import { AssessmentTable } from '@organisms';
import { patients } from '../data/mock';

// every assessment across patients, same list as the patient page
export function AssessmentsPage() {
  const owner = new Map(patients.flatMap((p) => p.assessments.map((a) => [a.id, p.name] as const)));
  const assessments = patients.flatMap((p) => p.assessments);

  return (
    <>
      <PageHeader title="Assessments" subtitle="All assessments across your patients" />
      <AssessmentTable title="All assessments" assessments={assessments} patientName={(a) => owner.get(a.id) ?? ''} />
    </>
  );
}
