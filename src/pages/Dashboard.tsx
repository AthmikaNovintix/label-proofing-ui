import { FileText, SplitSquareHorizontal, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f4f4] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#333333] tracking-tight mb-4">Label Proofing</h1>
          <p className="text-[#666666] text-lg">Select a workflow to proceed.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
        <div 
          onClick={() => navigate('/compare')}
          className="bg-white rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer border-t-4 border-transparent hover:border-[#D51900] group flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#D51900] group-hover:scale-110 transition-transform">
            <FileSearch className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#333333]">Existing + Master</h2>
          <p className="text-sm text-[#666666]">
            Upload a Current Version and a New Version to run the comparator analysis directly.
          </p>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => navigate('/form?flow=to-split')}
          className="bg-white rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer border-t-4 border-transparent hover:border-[#D51900] group flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#D51900] group-hover:scale-110 transition-transform">
            <SplitSquareHorizontal className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#333333]">Supportive + Master</h2>
          <p className="text-sm text-[#666666]">
            Submit a proof request and compare the structured form data alongside the new document in a split view.
          </p>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => navigate('/form?flow=to-compare')}
          className="bg-white rounded-xl p-8 hover:shadow-lg transition-all cursor-pointer border-t-4 border-transparent hover:border-[#D51900] group flex flex-col items-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#D51900] group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#333333]">Full Comparison</h2>
          <p className="text-sm text-[#666666]">
            Submit a proof request form, then proceed to the standard comparison view.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
