import { CategoryId } from "@/types/form";
import { Type, Shield, Barcode, Image } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: CategoryId | null;
  changeCounts: Record<CategoryId, number>;
  onSelect: (category: CategoryId) => void;
}

const tabConfig: { id: CategoryId; label: string; Icon: any }[] = [
  { id: "text", label: "Text", Icon: Type },
  { id: "symbol", label: "Symbols", Icon: Shield },
  { id: "barcode", label: "Barcodes", Icon: Barcode },
  { id: "image", label: "Images", Icon: Image },
];

const CategoryTabs = ({ activeCategory, changeCounts, onSelect }: CategoryTabsProps) => {
  return (
    <div className="py-4 px-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Select Change Category</p>
      <div className="grid grid-cols-4 gap-3">
        {tabConfig.map(({ id, label, Icon }) => {
          const isActive = activeCategory === id;
          const count = changeCounts[id];
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border-2 px-4 py-4 transition-all ${
                isActive
                  ? "border-primary bg-card shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
              <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                {label}
              </span>
              <span className={`text-xs ${count > 0 ? "text-badge-blue-foreground" : "text-muted-foreground"}`}>
                {count} change{count !== 1 ? "s" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
