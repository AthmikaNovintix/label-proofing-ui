import DiscrepancyDashboard from "@/components/DiscrepancyDashboard";

const DataTables = ({ formData, discrepancies }: { formData?: any, discrepancies?: any[] }) => (
  <DiscrepancyDashboard formData={formData} passedDiscrepancies={discrepancies} />
);

export default DataTables;
