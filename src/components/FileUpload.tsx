import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onImageUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PNG, JPG, or SVG file';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      setSuccess(false);
      return;
    }

    setError(null);
    setSuccess(true);
    setTimeout(() => {
      onImageUpload(file);
    }, 500);
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-50/50'
            : success
            ? 'border-green-400 bg-green-50/50'
            : error
            ? 'border-red-400 bg-red-50/50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-white/20'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept=".png,.jpg,.jpeg,.svg"
        />
        
        <div className="flex flex-col items-center">
          {success ? (
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          ) : error ? (
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
          )}
          
          <h3 className="text-2xl font-semibold text-white mb-2">
            {success ? 'Logo uploaded successfully!' : 'Upload your company logo'}
          </h3>
          
          <p className="text-gray-300 mb-6">
            {success
              ? 'Click "Generate Memes" to create hilarious variations'
              : 'Drag and drop your logo here, or click to browse'}
          </p>
          
          {!success && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">PNG</span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">JPG</span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">SVG</span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">Max 10MB</span>
            </div>
          )}
          
          {!success && (
            <label
              htmlFor="file-upload"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer"
            >
              Choose File
            </label>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;