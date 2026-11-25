import { PageHeader } from '@molecules';
import { ReportTable } from '@organisms';
import { patients } from '../data/mock';

// every report across patients, same list as the patient page
export function ReportsPage() {
  const owner = new Map(patients.flatMap((p) => p.reports.map((r) => [r.id, p.name] as const)));
  const reports = patients.flatMap((p) => p.reports).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader title="Reports" subtitle="All reports across your patients" />
      <ReportTable title="All reports" reports={reports} patientName={(r) => owner.get(r.id) ?? ''} />
    </>
  );
}
