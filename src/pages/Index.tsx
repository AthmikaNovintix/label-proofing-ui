import { useState } from "react";
import { ScanLine, Activity, RefreshCw, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Dropzone from "@/components/Dropzone";
import VisualDiffViewer from "@/components/VisualDiffViewer";
import DataTables from "@/components/DataTables";

const Index = () => {
  const [baseFile, setBaseFile] = useState<File | null>(null);
  const [childFile, setChildFile] = useState<File | null>(null);
  const [analysisRun, setAnalysisRun] = useState(true); // true to show demo data

  const location = useLocation();
  const formData = location.state?.formData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            <h1 className="text-lg font-semibold tracking-tight">
              Label Proofing
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-primary-foreground/90 font-mono">
          <Link
            to="/"
            className="bg-white text-primary px-4 py-1.5 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-2 rounded-sm shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-primary px-4 py-1.5 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-2 rounded-sm shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-sm">
            <Activity className="h-3.5 w-3.5" />
            <span>System Operational</span>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Upload Section */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <Dropzone label="Upload Base Label (PDF / Image)" file={baseFile} onFileSelect={setBaseFile} />
            <Dropzone label="Upload Child Label" file={childFile} onFileSelect={setChildFile} />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setAnalysisRun(true)}
              className="bg-primary text-primary-foreground px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              RUN COMPARATOR ANALYSIS
            </button>
          </div>
        </section>

        {analysisRun && (
          <>
            {/* Visual Diff */}
            <section>
              <VisualDiffViewer />
            </section>

            {/* Data Tables */}
            <section>
              <DataTables formData={formData} />
            </section>

            {/* Footer stamp */}
            <footer className="border-t border-border pt-4 pb-8 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Report generated: {new Date().toISOString().split("T")[0]}</span>
              <button className="bg-[#D51900] text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-[#b01300] transition-colors rounded shadow-sm font-sans">
                Generate Report
              </button>
            </footer>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
