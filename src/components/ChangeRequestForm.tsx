import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ScanLine, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { CategoryId, AttributeDef, FormMetadata } from "@/types/form";
import { CATEGORIES, CATEGORY_ORDER, METADATA_FIELDS } from "@/data/attributes";
import { dummyFormDataScene2 } from "@/data/dummyData";
import CategoryTabs from "./CategoryTabs";
import AttributeGroup from "./AttributeGroup";
import SummaryBar from "./SummaryBar";

interface ChangeData {
  changeType: string;
  expectedValue: string;
}

const STORAGE_KEY = "lcm_cr_draft";

const emptyMetadata: FormMetadata = {
  cr_number: "",
  part_number: "",
  label_version: "",
  product_name: "",
  requested_by: "",
  date: "",
};

const ChangeRequestForm = () => {
  const [metadata, setMetadata] = useState<FormMetadata>(emptyMetadata);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [changes, setChanges] = useState<Record<string, ChangeData>>({});
  const [customAttributes, setCustomAttributes] = useState<Record<string, AttributeDef[]>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const attributePanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flow = searchParams.get('flow');

  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      setShowDraftBanner(true);
    } else if (flow === 'to-split' || flow === 'to-compare') {
      // Pre-populate with demo data so the context view has something to show
      setMetadata(dummyFormDataScene2.metadata as FormMetadata);
      setChanges(dummyFormDataScene2.changes as Record<string, ChangeData>);
    }
  }, [flow]);

  const restoreDraft = () => {
    try {
      const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (draft.metadata) setMetadata(draft.metadata);
      if (draft.changes) setChanges(draft.changes);
      if (draft.customAttributes) setCustomAttributes(draft.customAttributes);
      if (draft.activeCategory) setActiveCategory(draft.activeCategory);
      setShowDraftBanner(false);
      toast.success("Draft restored");
    } catch {
      toast.error("Failed to restore draft");
    }
  };

  const dismissDraft = () => setShowDraftBanner(false);

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ metadata, changes, customAttributes, activeCategory }));
    toast.success("Draft saved");
  };

  const getChangesForCategory = useCallback(
    (catId: CategoryId) => {
      const cat = CATEGORIES[catId];
      let count = 0;
      for (const group of cat.groups) {
        const allAttrs = [...group.attributes, ...(customAttributes[group.id] || [])];
        for (const attr of allAttrs) {
          if (changes[attr.id]?.changeType) count++;
        }
      }
      return count;
    },
    [changes, customAttributes]
  );

  const changeCounts: Record<CategoryId, number> = {
    text: getChangesForCategory("text"),
    symbol: getChangesForCategory("symbol"),
    barcode: getChangesForCategory("barcode"),
    image: getChangesForCategory("image"),
  };

  const totalChanges = Object.values(changeCounts).reduce((a, b) => a + b, 0);

  const handleCategorySelect = (cat: CategoryId) => {
    const newCategory = cat === activeCategory ? null : cat;
    setActiveCategory(newCategory);
    if (newCategory) {
      setTimeout(() => {
        attributePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleChangeType = (attrId: string, value: string) => {
    setChanges((prev) => ({
      ...prev,
      [attrId]: { ...prev[attrId], changeType: value, expectedValue: prev[attrId]?.expectedValue || "" },
    }));
  };

  const handleExpectedValue = (attrId: string, value: string) => {
    setChanges((prev) => ({
      ...prev,
      [attrId]: { ...prev[attrId], expectedValue: value, changeType: prev[attrId]?.changeType || "" },
    }));
  };

  const handleClear = (attrId: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomAttributes((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = next[key].filter((a) => a.id !== attrId);
        }
        return next;
      });
      setChanges((prev) => {
        const next = { ...prev };
        delete next[attrId];
        return next;
      });
    } else {
      setChanges((prev) => ({ ...prev, [attrId]: { changeType: "", expectedValue: "" } }));
    }
  };

  const handleAddCustom = (groupId: string, name: string, changeType: string, expectedValue: string) => {
    const id = `custom_${groupId}_${Date.now()}`;
    setCustomAttributes((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), { id, label: name, placeholder: "Custom parameter", isCustom: true }],
    }));
    if (changeType) {
      setChanges((prev) => ({ ...prev, [id]: { changeType, expectedValue } }));
    }
  };

  const handleMetadataChange = (field: string, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleGenerate = () => {
    const errors: Record<string, boolean> = {};
    if (!metadata.cr_number.trim()) errors.cr_number = true;
    if (!metadata.part_number.trim()) errors.part_number = true;
    if (!metadata.label_version.trim()) errors.label_version = true;

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Proofing Request Form has been submitted");
    
    const formData = { metadata, changes, customAttributes, totalChanges };
    
    if (flow === 'to-compare') {
      navigate('/compare', { state: { formData } });
    } else if (flow === 'to-split') {
      navigate('/compare-form-new', { state: { formData } });
    } else {
      navigate('/');
    }
  };

  const activeCat = activeCategory ? CATEGORIES[activeCategory] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-primary-foreground hover:text-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <ScanLine size={20} />
            <span className="text-lg font-semibold tracking-tight">Label Proofing</span>
          </div>
        </div>
        <span className="text-sm text-primary-foreground/70">Proofing Request</span>
      </nav>

      {/* Draft banner */}
      {showDraftBanner && (
        <div className="bg-badge-blue px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-badge-blue-foreground">
            A saved draft was found. Would you like to restore it?
          </span>
          <div className="flex gap-2">
            <button onClick={restoreDraft} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-colors">
              Restore draft
            </button>
            <button onClick={dismissDraft} className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-6 space-y-5">
        {/* Header Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-semibold text-foreground">Proofing Request Form</h1>
            {totalChanges > 0 && (
              <span className="inline-flex items-center rounded-full bg-badge-blue px-3 py-1 text-sm font-semibold text-badge-blue-foreground">
                {totalChanges} change{totalChanges !== 1 ? "s" : ""} defined
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-5">Define expected changes to be validated against the comparator output</p>

          <div className="grid grid-cols-2 gap-4">
            {METADATA_FIELDS.map((field: any) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {field.label}
                  {field.required && <span className="text-destructive ml-0.5">*</span>}
                </label>
                <input
                  type={field.type === "date" ? "date" : "text"}
                  value={(metadata as any)[field.id] || ""}
                  onChange={(e) => handleMetadataChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`h-10 w-full rounded-md border px-3 text-sm text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                    validationErrors[field.id] ? "border-destructive ring-1 ring-destructive" : "border-input"
                  }`}
                />
                {validationErrors[field.id] && (
                  <p className="mt-1 text-xs text-destructive">This field is required</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <CategoryTabs activeCategory={activeCategory} changeCounts={changeCounts} onSelect={handleCategorySelect} />

          {/* Attribute Panel - only shown when category selected */}
          {activeCat && activeCategory && (
            <div ref={attributePanelRef} className="border-t-2 border-primary">
              <div className="px-5 py-3 bg-muted flex items-center justify-between border-b border-border">
                <span className="text-sm font-semibold text-foreground">{activeCat.label} attributes</span>
                <span className="text-xs text-muted-foreground">Select an attribute to define its change</span>
              </div>

              <div>
                {activeCat.groups.map((group) => (
                  <AttributeGroup
                    key={group.id}
                    groupId={group.id}
                    name={group.name}
                    attributes={group.attributes}
                    changes={changes}
                    customAttributes={customAttributes[group.id] || []}
                    categoryId={activeCategory}
                    onChangeType={handleChangeType}
                    onExpectedValue={handleExpectedValue}
                    onClear={handleClear}
                    onAddCustom={handleAddCustom}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <SummaryBar counts={changeCounts} />

        <div className="flex items-center justify-end gap-3">
          <button onClick={saveDraft} className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Save size={16} />
            Save draft
          </button>
          <button onClick={handleGenerate} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestForm;
