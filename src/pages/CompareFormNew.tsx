import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, ScanLine, Activity, RefreshCw, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { FormValidationSummary } from "@/components/FormValidationSummary";
import { FormDataContextView } from "@/components/FormDataContextView";
import Dropzone from "@/components/Dropzone";
import { useState, useRef, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { PLACEHOLDER_LABEL_CHILD } from "@/components/VisualDiffViewer";

const CompareFormNew = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  const [childFile, setChildFile] = useState<File | null>(null);

  const imageRef = useRef<any>(null);

  const handleZoomIn = useCallback(() => {
    imageRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    imageRef.current?.zoomOut();
  }, []);

  const handleReset = useCallback(() => {
    imageRef.current?.resetTransform();
  }, []);

  return (
    <div className="min-h-screen bg-white">
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
            onClick={() => window.location.href = window.location.pathname}
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
      
      <div className="flex flex-col w-full min-h-[calc(100vh-65px)]">
        <div className="flex w-full flex-1">
          {/* Left Panel: Form Data (Read-only) */}
          <div className="w-1/2 border-r border-[#F4F4F4] bg-[#F4F4F4]/30 p-8 overflow-y-auto">
            <h2 className="text-xl font-bold text-[#D51900] mb-6 border-b border-[#D51900]/20 pb-2">Proof Request Context</h2>
            <FormDataContextView formData={formData} />
          </div>
          
          {/* Right Panel: Document Viewer */}
          <div className="w-1/2 p-8 bg-gray-50 flex flex-col relative overflow-hidden">
            <h2 className="text-xl font-bold text-[#333333] mb-6 border-b border-gray-200 pb-2">Upload the New Version Label</h2>
            <div className="mb-6 flex-shrink-0">
              <Dropzone label="Upload New Version Image/PDF" file={childFile} onFileSelect={setChildFile} />
            </div>
            
            <div className="mb-6 flex justify-center">
              <button
                className="bg-[#D51900] text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-[#b01300] transition-colors rounded shadow-sm"
              >
                RUN PROOFING ANALYSIS
              </button>
            </div>
            
            <div className="flex-1 flex flex-col min-h-[400px]">
              {/* Toolbar */}
              <div className="flex items-center justify-between border border-border bg-white px-4 py-2 border-b-0">
                <span className="text-sm font-bold uppercase tracking-wider text-[#333333]">
                  New Version Label
                </span>
                <div className="flex items-center gap-1">
                    <button onClick={handleZoomIn} className="p-1.5 hover:bg-secondary transition-colors border border-border bg-white rounded-sm shadow-sm" title="Zoom In">
                      <ZoomIn className="h-4 w-4 text-gray-700" />
                    </button>
                    <button onClick={handleZoomOut} className="p-1.5 hover:bg-secondary transition-colors border border-border bg-white rounded-sm shadow-sm" title="Zoom Out">
                      <ZoomOut className="h-4 w-4 text-gray-700" />
                    </button>
                    <button onClick={handleReset} className="p-1.5 hover:bg-secondary transition-colors border border-border bg-white rounded-sm shadow-sm" title="Reset">
                      <RotateCcw className="h-4 w-4 text-gray-700" />
                    </button>
                    {childFile && (
                      <button onClick={() => setChildFile(null)} className="ml-2 text-xs font-semibold uppercase tracking-wider bg-gray-200 text-gray-700 hover:bg-gray-300 px-3 py-1.5 rounded shadow-sm transition-colors border border-border">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                {/* Image display with pan/zoom */}
                <div className="flex-1 border border-border shadow-inner flex items-center justify-center bg-[#F4F4F4]/50 relative overflow-hidden">
                  <TransformWrapper ref={imageRef} minScale={0.5} maxScale={4} initialScale={1}>
                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img 
                        src={childFile ? URL.createObjectURL(childFile) : PLACEHOLDER_LABEL_CHILD} 
                        alt="New Version Label" 
                        className="max-w-full max-h-full object-contain pointer-events-none" 
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              </div>
          </div>
        </div>
      </div>
      
      {/* Form Validation Summary */}
      <div className="flex-1 p-8 bg-gray-50 border-t border-gray-200">
        <FormValidationSummary />
      </div>

      {/* Footer stamp */}
      <footer className="mt-auto border-t border-border px-8 pt-4 pb-8 flex items-center justify-between text-xs text-muted-foreground font-mono bg-white">
        <span>Report generated: {new Date().toISOString().split("T")[0]}</span>
        <button className="bg-[#D51900] text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider hover:bg-[#b01300] transition-colors rounded shadow-sm font-sans">
          Generate Report
        </button>
      </footer>
    </div>
  );
};

export default CompareFormNew;
