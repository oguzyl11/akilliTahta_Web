// =============================================================================
// PdfUploader Component — İçerik Editörü
// =============================================================================

'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { ALLOWED_PDF_TYPES, MAX_PDF_SIZE_BYTES } from '@/utils/constants';

interface PdfUploaderProps {
  onUploadSuccess: (file: File) => void;
}

export function PdfUploader({ onUploadSuccess }: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        simulateUpload(selectedFile);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_PDF_SIZE_BYTES,
    maxFiles: 1,
    multiple: false,
  });

  // Mock Upload Progress (Gerçek API bağlanınca değişecek)
  const simulateUpload = (selectedFile: File) => {
    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onUploadSuccess(selectedFile);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          'relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer',
          'bg-slate-800/50 backdrop-blur-xl group',
          isDragActive && !isDragReject ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800',
          isDragReject ? 'border-rose-500 bg-rose-500/10' : '',
          file ? 'border-emerald-500 bg-emerald-500/5 cursor-default' : ''
        )}
      >
        <input {...getInputProps()} />

        <div className="p-12 text-center">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center pointer-events-none"
              >
                <div className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300',
                  isDragActive ? 'bg-indigo-500/20' : 'bg-slate-700/50 group-hover:bg-slate-700'
                )}>
                  <UploadCloud
                    size={40}
                    className={cn(
                      'transition-colors duration-300',
                      isDragActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'
                    )}
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">
                  {isDragActive ? 'Dosyayı Buraya Bırakın' : 'PDF Dosyanızı Sürükleyin'}
                </h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  veya seçmek için tıklayın. Sadece PDF dosyaları kabul edilir (Max: 200MB).
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 relative">
                  <FileText size={32} className="text-emerald-400" />
                  {progress === 100 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-emerald-500 rounded-full text-white"
                    >
                      <CheckCircle2 size={20} />
                    </motion.div>
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-slate-200 mb-1 truncate max-w-xs">
                  {file.name}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="w-full max-w-xs">
                    <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-indigo-400 mt-2 text-center font-medium">
                      Yükleniyor... %{progress}
                    </p>
                  </div>
                )}

                {/* Remove Button */}
                {!isUploading && (
                  <button
                    onClick={removeFile}
                    className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <X size={20} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
