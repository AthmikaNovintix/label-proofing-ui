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
    <div className="flex-1">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </label>
      {file ? (
        <div className="border border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-mono truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="p-1 hover:bg-secondary transition-colors"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
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
          className={`border-2 border-dashed p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragOver
              ? "border-primary bg-secondary"
              : "border-border hover:border-primary/40 bg-card"
          }`}
        >
          <Upload className="h-6 w-6 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">
            Drag & drop or <span className="underline">browse</span>
          </span>
          <span className="text-xs text-muted-foreground mt-1">PDF / PNG / JPEG / TIFF</span>
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
