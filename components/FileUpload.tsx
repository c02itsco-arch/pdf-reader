
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { TrashIcon } from './icons/TrashIcon';

interface FileUploadProps {
  files: File[];
  onFileChange: (files: FileList | null) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFileChange, onAnalyze, onClear, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileChange(event.dataTransfer.files);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
        <label 
            htmlFor="file-upload" 
            className="relative block w-full rounded-lg border-2 border-dashed border-slate-600 p-8 md:p-12 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center space-y-3">
                <UploadIcon className="w-12 h-12 text-slate-500" />
                <span className="mt-2 block text-sm font-semibold text-slate-300">ลากไฟล์ PDF มาวางที่นี่</span>
                <p className="text-xs text-slate-500">หรือ <span className="text-blue-400">คลิกเพื่อเลือกไฟล์</span></p>
                <p className="text-xs text-slate-500 mt-1">(สามารถเลือกได้หลายไฟล์)</p>
            </div>
            <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                multiple
                onChange={handleFileSelect}
                disabled={isLoading}
            />
        </label>
        
        {files.length > 0 && (
            <div className="w-full">
                <h3 className="font-semibold text-slate-400 mb-2">ไฟล์ที่เลือก:</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center bg-slate-700/50 p-2 rounded-md text-sm">
                            <FileIcon className="w-5 h-5 mr-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate flex-grow">{file.name}</span>
                            <span className="text-slate-500 ml-2 text-xs flex-shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
                onClick={onAnalyze}
                disabled={isLoading || files.length === 0}
                className="w-full flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200"
            >
                วิเคราะห์เอกสาร
            </button>
            <button
                onClick={onClear}
                disabled={isLoading || files.length === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    </div>
  );
};

export default FileUpload;
