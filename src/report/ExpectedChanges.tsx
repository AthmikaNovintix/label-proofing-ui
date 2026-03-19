import { useState } from 'react';
import { Badge } from './Badge';
import { proofRequestAllChanges, type ProofRequestChangeItem } from '@/data/dummyData';
import { ATTRIBUTE_LOOKUP } from '@/data/attributes';

type Tab = 'Text' | 'Symbols' | 'Barcodes' | 'Images';

const TABS: Tab[] = ['Text', 'Symbols', 'Barcodes', 'Images'];

const tabToCategory: Record<Tab, string> = {
  Text: 'Text', Symbols: 'Symbol', Barcodes: 'Barcode', Images: 'Image',
};

interface FormData {
  changes: Record<string, { changeType: string; expectedValue: string }>;
}

const notFoundIds = new Set(proofRequestAllChanges.filter(c => !c.found).map(c => c.id));

function buildItemsFromFormData(formData: FormData): ProofRequestChangeItem[] {
  return Object.entries(formData.changes).map(([id, change]) => {
    const lookup = ATTRIBUTE_LOOKUP[id];
    const found = !notFoundIds.has(id);
    return {
      id,
      category: lookup?.category ?? 'Text',
      label: lookup?.label ?? id,
      changeType: change.changeType,
      expectedValue: change.expectedValue,
      actualValue: found ? change.expectedValue : '— NOT FOUND —',
      found,
    };
  });
}

function ChangesTable({ items }: { items: ProofRequestChangeItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-6">No changes in this category</p>;
  }
  return (
    <table className="w-full border-collapse border border-gray-300 text-sm">
      <thead>
        <tr>
          <th colSpan={3} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide bg-[#eff6ff] border-t-4 border-t-[#3b82f6] border-b border-b-gray-300 border-r border-r-gray-400" style={{ color: '#2563eb' }}>Expected Changes</th>
          <th colSpan={3} className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide bg-[#f0fdf4] border-t-4 border-t-[#22c55e] border-b border-b-gray-300" style={{ color: '#16a34a' }}>Changes Done</th>
        </tr>
        <tr className="border-b border-gray-300">
          <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-[#eff6ff] border-r border-gray-200 w-44">Attribute</th>
          <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-[#eff6ff] border-r border-gray-200 w-32">Change Type</th>
          <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-[#eff6ff] border-r border-r-gray-400">Expected Value</th>
          <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-[#f0fdf4] border-r border-gray-200 w-44">Attribute</th>
          <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-[#f0fdf4] border-r border-gray-200 w-32">Change Type</th>
          <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wide text-gray-500 font-bold bg-[#f0fdf4]">Actual Value</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b border-gray-200 last:border-0">
            <td className="px-4 py-2 text-gray-700 bg-[#eff6ff] border-r border-gray-200">{item.label}</td>
            <td className="px-4 py-2 bg-[#eff6ff] border-r border-gray-200"><Badge type={item.changeType as any} /></td>
            <td className="px-4 py-2 text-gray-700 font-mono text-xs bg-[#eff6ff] border-r border-r-gray-400">{item.expectedValue}</td>
            <td className="px-4 py-2 text-gray-700 bg-[#f0fdf4] border-r border-gray-200">{item.label}</td>
            <td className="px-4 py-2 bg-[#f0fdf4] border-r border-gray-200"><Badge type={item.changeType as any} /></td>
            <td className={`px-4 py-2 font-mono text-xs bg-[#f0fdf4] ${!item.found ? 'text-red-600 italic' : 'text-gray-700'}`}>{item.actualValue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ExpectedChanges({ formData }: { formData?: FormData }) {
  const [activeTab, setActiveTab] = useState<Tab>('Text');
  const allItems = formData ? buildItemsFromFormData(formData) : proofRequestAllChanges;

  return (
    <div className="space-y-4">
      <h3 className="text-sm uppercase tracking-wide font-bold text-gray-700">Expected Changes</h3>

      {/* ── Screen only: tabbed view ── */}
      <div className="print:hidden">
        {/* Tab bar */}
        <div className="flex">
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm transition-colors border border-b-0 -mb-px relative z-10 ${
                  isActive
                    ? 'bg-[#064b75] text-white border-[#064b75]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Content panel — bordered box with shadow to frame the active section */}
        <div className="border border-gray-300 shadow-md bg-white">
          <div className="p-6">
            <ChangesTable items={allItems.filter(c => c.category === tabToCategory[activeTab])} />
          </div>
        </div>
      </div>

      {/* ── Print only: all categories stacked ── */}
      <div className="hidden print:block space-y-6">
        {TABS.map((tab) => {
          const items = allItems.filter(c => c.category === tabToCategory[tab]);
          if (items.length === 0) return null;
          return (
            <div key={tab} className="bg-white border border-gray-300">
              <div className="bg-[#064b75] text-white px-4 py-2 text-xs font-bold uppercase tracking-wide">
                {tab}
              </div>
              <div className="p-4">
                <ChangesTable items={items} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
