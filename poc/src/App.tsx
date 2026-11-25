import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AppLayout } from '@organisms';
import { AssessmentPage, AssessmentsPage, LoginPage, PatientPage, PatientsPage, QuestionPage, ReportPage, ReportsPage, SafaPage } from '@pages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/assessments/:id" element={<AssessmentPage />} />
          <Route path="/assessments/:id/q/:num" element={<QuestionPage />} />
          <Route path="/assessments/:id/safa" element={<SafaPage />} />
          <Route path="/assessments/:id/report" element={<ReportPage />} />
        </Route>
        {/* anything else goes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
