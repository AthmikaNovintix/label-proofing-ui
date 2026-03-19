import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/report/ThemeContext';
import { ReportHeader } from '@/report/ReportHeader';
import { MetadataRow } from '@/report/MetadataRow';
import { FrameA, FrameB, FrameC } from '@/report/Frames';
import type { ReportData } from '@/report/types';

const defaultReportData: ReportData = {
  reportId: '',
  crNumber: 'CR-2025-0042',
  sku: '08714729-MX',
  currentRevision: 'Rev B',
  newRevision: 'Rev C',
  currentLabelName: 'LCN-187301111_1_Rev-D',
  newLabelName: 'LCN-187301111_1_Rev-E',
  currentLabelUrl: '/LCN-187301111_1_Rev-D.png',
  newLabelUrl: '/LCN-187301111_1_Rev-E.png',
  currentBoxes: [],
  newBoxes: [],
  requirements: [],
  discrepancyCategories: [],
};

const ReportPageInner = () => {
  const location = useLocation();
  const initialScenario = (location.state?.scenario as 'A' | 'B' | 'C') ?? 'A';
  const reportData: ReportData = location.state?.reportData ?? defaultReportData;

  const formData = location.state?.formData;
  const [activeScenario, setActiveScenario] = useState<'A' | 'B' | 'C'>(initialScenario);


  return (
    <div className="min-h-screen bg-gray-100">
      <ReportHeader
        activeScenario={activeScenario}
        onScenarioChange={setActiveScenario}
        reportId={reportData.reportId || undefined}
      />
      <MetadataRow data={reportData} />
      <div className="report-content-wrap max-w-[1600px] mx-auto px-8 py-6">
        {activeScenario === 'A' && <FrameA data={reportData} />}
        {activeScenario === 'B' && <FrameB formData={formData} />}
        {activeScenario === 'C' && <FrameC formData={formData} />}
      </div>
    </div>
  );
};

const ReportPage = () => (
  <ThemeProvider>
    <ReportPageInner />
  </ThemeProvider>
);

export default ReportPage;
