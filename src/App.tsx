import React, { useState, useCallback, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Asset } from './types';
import { analyzeAssetDocuments } from './services/geminiService';
import { renderPdfPagesAsImages } from './services/pdfService';
import FileUpload from './components/FileUpload';
import AssetTable from './components/AssetTable';
import AssetChart from './components/AssetChart';
import Loader from './components/Loader';
import { ExportIcon } from './components/icons/ExportIcon';

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisDate, setAnalysisDate] = useState<Date | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
      setAssets([]);
      setError(null);
      setAnalysisDate(null);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setAssets([]);
    setError(null);
    setAnalysisDate(null);
  };

  const handleAnalyze = useCallback(async () => {
    if (files.length === 0) {
      setError('กรุณาเลือกไฟล์ PDF ก่อน');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAssets([]);
    setAnalysisDate(null);

    try {
      const imagePromises = files.map(file => renderPdfPagesAsImages(file));
      const imagesPerFile = await Promise.all(imagePromises);
      const allImages = imagesPerFile.flat(); 

      if (allImages.length === 0) {
        throw new Error('ไม่สามารถดึงรูปภาพจากไฟล์ PDF ได้ หรือไฟล์ไม่มีเนื้อหา');
      }
      
      const extractedAssets = await analyzeAssetDocuments(allImages);
      setAssets(extractedAssets);
      setAnalysisDate(new Date());
    } catch (err: unknown) {
      console.error('Analysis Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่รู้จัก';
      setError(`เกิดข้อผิดพลาดในการวิเคราะห์: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [files]);

  const categoryCounts = useMemo(() => {
    if (assets.length === 0) return {};
    return assets.reduce((acc, asset) => {
      const category = asset.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }, [assets]);

  const handleExportPdf = async () => {
    if (!exportRef.current || assets.length === 0) return;
    
    setIsLoading(true); // Show loader during PDF generation
    try {
        const canvas = await html2canvas(exportRef.current, {
            scale: 2,
            backgroundColor: '#0f172a' // bg-slate-900
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
    
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`asset-analysis-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch(err) {
        console.error("PDF Export Error:", err);
        setError("ไม่สามารถสร้างไฟล์ PDF ได้");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            เครื่องมือวิเคราะห์เอกสารทรัพย์สิน
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            อัปโหลดไฟล์ PDF (รวมถึงไฟล์ที่เป็นรูปภาพ) เพื่อใช้ AI สกัดข้อมูลสำคัญและจัดระเบียบให้เป็นตารางโดยอัตโนมัติ
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-2xl shadow-lg p-6 md:p-8 border border-slate-700">
          <FileUpload
            files={files}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <span className="font-medium">ข้อผิดพลาด:</span> {error}
            </div>
          )}
        </div>

        {isLoading && <Loader />}

        {!isLoading && assets.length > 0 && (
          <div className="mt-12 max-w-7xl mx-auto">
             <div className="flex justify-end mb-4">
                <button
                    onClick={handleExportPdf}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-all duration-200"
                >
                    <ExportIcon className="w-4 h-4" />
                    Export PDF
                </button>
            </div>
            <div ref={exportRef} className="p-6 bg-slate-900">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-200">รายงานสรุปผลการวิเคราะห์</h2>
                        {analysisDate && <p className="text-sm text-slate-400 mt-1">ณ วันที่: {analysisDate.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</p>}
                    </div>
                    <div className="mt-4 md:mt-0 bg-blue-900/50 border border-blue-700 rounded-lg py-2 px-4">
                        <p className="text-lg text-slate-300 text-center">ทรัพย์สินพร้อมจำหน่าย: <span className="font-bold text-xl text-blue-300">{assets.length}</span> รายการ</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 mt-6">
                    <AssetChart data={categoryCounts} />
                    <AssetTable assets={assets} />
                </div>
            </div>
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-600">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
