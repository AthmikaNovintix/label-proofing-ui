import { useState } from "react";
import { ChevronDown, FolderOpen } from "lucide-react";
import { AttributeDef, CategoryId } from "@/types/form";
import AttributeRow from "./AttributeRow";
import AddParameterForm from "./AddParameterForm";

interface ChangeData {
  changeType: string;
  expectedValue: string;
}

interface AttributeGroupProps {
  groupId: string;
  name: string;
  attributes: AttributeDef[];
  changes: Record<string, ChangeData>;
  customAttributes: AttributeDef[];
  categoryId: CategoryId;
  onChangeType: (attrId: string, value: string) => void;
  onExpectedValue: (attrId: string, value: string) => void;
  onClear: (attrId: string, isCustom: boolean) => void;
  onAddCustom: (groupId: string, name: string, changeType: string, expectedValue: string) => void;
}

const AttributeGroup = ({
  groupId,
  name,
  attributes,
  changes,
  customAttributes,
  categoryId,
  onChangeType,
  onExpectedValue,
  onClear,
  onAddCustom,
}: AttributeGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allAttrs = [...attributes, ...customAttributes];
  const definedCount = allAttrs.filter(
    (a) => changes[a.id]?.changeType && changes[a.id].changeType !== ""
  ).length;

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Group header — visually distinct from attribute rows */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 bg-section-header hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <FolderOpen size={15} className="text-primary/70" />
          <ChevronDown
            size={14}
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <span className="text-sm font-semibold text-foreground tracking-tight">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{allAttrs.length} items</span>
          {definedCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-badge-blue px-2.5 py-0.5 text-xs font-medium text-badge-blue-foreground">
              {definedCount} defined
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border/50">
          {attributes.map((attr, i) => (
            <AttributeRow
              key={attr.id}
              id={attr.id}
              label={attr.label}
              placeholder={attr.placeholder}
              changeType={changes[attr.id]?.changeType || ""}
              expectedValue={changes[attr.id]?.expectedValue || ""}
              isEven={i % 2 === 0}
              categoryId={categoryId}
              onChangeType={(v) => onChangeType(attr.id, v)}
              onExpectedValue={(v) => onExpectedValue(attr.id, v)}
              onClear={() => onClear(attr.id, false)}
            />
          ))}

          {customAttributes.map((attr, i) => (
            <AttributeRow
              key={attr.id}
              id={attr.id}
              label={attr.label}
              placeholder={attr.placeholder}
              changeType={changes[attr.id]?.changeType || ""}
              expectedValue={changes[attr.id]?.expectedValue || ""}
              isCustom
              isEven={(attributes.length + i) % 2 === 0}
              categoryId={categoryId}
              onChangeType={(v) => onChangeType(attr.id, v)}
              onExpectedValue={(v) => onExpectedValue(attr.id, v)}
              onClear={() => onClear(attr.id, true)}
            />
          ))}

          <AddParameterForm
            categoryId={categoryId}
            onAdd={(name, changeType, expectedValue) =>
              onAddCustom(groupId, name, changeType, expectedValue)
            }
          />
        </div>
      )}
    </div>
  );
};

export default AttributeGroup;