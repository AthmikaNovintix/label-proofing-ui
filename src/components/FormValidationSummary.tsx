import { Type, Barcode, Image, Shield } from "lucide-react";

type Category = "Text" | "Symbol" | "Barcode" | "Image";
type Status = "Matched Requirements" | "Missing Requirements" | "Discrepancies";

const statusConfig: Record<Status, { label: string; borderClass: string; textClass: string }> = {
  "Matched Requirements": { label: "Matched Requirements", borderClass: "border-l-status-added", textClass: "text-status-added" },
  "Missing Requirements": { label: "Missing Requirements", borderClass: "border-l-[#D51900]", textClass: "text-[#D51900]" },
  "Discrepancies": { label: "Discrepancies", borderClass: "border-l-status-modified", textClass: "text-status-modified" },
};

const categoryIcons: Record<string, typeof Type> = {
  Text: Type,
  Barcode: Barcode,
  Image: Image,
  Symbol: Shield,
};

const statusOrder: Status[] = ["Matched Requirements", "Missing Requirements", "Discrepancies"];

export const FormValidationSummary = () => {
  // Mock data for Scenario 3
  const mockCounts: Record<Status, Record<Category, number>> = {
    "Matched Requirements": { Text: 5, Symbol: 2, Barcode: 1, Image: 1 },
    "Missing Requirements": { Text: 1, Symbol: 0, Barcode: 0, Image: 0 },
    "Discrepancies": { Text: 2, Symbol: 0, Barcode: 0, Image: 0 },
  };

  const totalsByStatus = statusOrder.reduce((acc, status) => {
    acc[status] = Object.values(mockCounts[status]).reduce((a, b) => a + b, 0);
    return acc;
  }, {} as Record<Status, number>);

  const total = Object.values(totalsByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-card border border-border mt-6 w-full shadow-sm rounded-sm">
      <div className="bg-secondary/50 px-4 py-2 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#333333]">Form Validation Summary</span>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div className="text-sm">
          <span className="font-semibold text-foreground">Total Validated Elements:</span>{" "}
          <span className="font-mono font-bold">{total}</span>
        </div>

        {/* Status Counts Row */}
        <div className="grid grid-cols-3 gap-8 text-sm pb-3 border-b border-border">
          {statusOrder.map((status) => {
            const cfg = statusConfig[status];
            const statusCount = totalsByStatus[status];
            return (
              <div key={status} className="flex items-baseline gap-2">
                <span className={`font-semibold ${cfg.textClass}`}>{status}:</span>
                <span className={`font-mono font-bold ${cfg.textClass}`}>{statusCount}</span>
              </div>
            );
          })}
        </div>

        {/* Category Counts Row */}
        <div className="grid grid-cols-3 gap-8 text-sm pt-3">
          {statusOrder.map((status) => {
            const categoryBreakdown = mockCounts[status];
            return (
              <div key={`${status}-cats`} className="space-y-1">
                {(["Text", "Symbol", "Barcode", "Image"] as Category[]).map((cat) => {
                  const CatIcon = categoryIcons[cat] || Type;
                  const catCount = categoryBreakdown[cat];
                  return (
                    <div key={cat} className="flex items-center gap-2 text-sm">
                      <CatIcon className={`h-4 w-4 shrink-0 ${catCount > 0 ? statusConfig[status].textClass + '/70' : 'text-muted-foreground'}`} />
                      <span className={catCount > 0 ? statusConfig[status].textClass : "text-muted-foreground"}>{cat}:</span>
                      <span className={`font-mono font-semibold ml-auto ${catCount > 0 ? statusConfig[status].textClass : "text-muted-foreground"}`}>{catCount}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
