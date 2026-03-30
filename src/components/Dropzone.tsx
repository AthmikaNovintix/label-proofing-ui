import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

interface DropzoneProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const Dropzone = ({ label, file, onFileSelect }: DropzoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) onFileSelect(droppedFile);
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) onFileSelect(selected);
  };

  return (
    <div className="flex-1 min-w-0">
      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-[#64748b] mb-3">
        {label}
      </label>
      {file ? (
        <div className="border border-gray-200 bg-slate-50/50 p-4 flex items-center justify-between group transition-all hover:border-gray-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white p-2 border border-gray-100 shadow-sm rounded">
              <FileText className="h-5 w-5 text-[#d51900]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#334155] truncate leading-tight">{file.name}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#94a3b8] mt-0.5">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • READY
              </span>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="p-1.5 hover:bg-red-50 hover:text-red-600 transition-colors text-slate-400 group-hover:text-slate-600 border border-transparent hover:border-red-100 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed h-[160px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? "border-[#d51900] bg-red-50/10 shadow-inner"
              : "border-gray-200 hover:border-[#d51900]/50 hover:bg-red-50/5 bg-white"
          }`}
        >
          <Upload className="h-7 w-7 text-slate-300 mb-3" />
          <div className="text-center">
            <span className="text-[15px] text-[#334155] block font-medium">
              Drag & drop or <span className="underline decoration-slate-300 underline-offset-4 hover:text-[#d51900] transition-colors">browse</span>
            </span>
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mt-2 block">
              PDF / PNG / JPEG / TIFF
            </span>
          </div>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default Dropzone;
