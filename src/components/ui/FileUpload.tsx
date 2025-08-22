import React, { useState, useRef } from 'react';
import { Upload, X, File, Image } from 'lucide-react';
import { FileUploadProps } from '../../types';
import { validateFileSize, validateFileType, formatFileSize, isImageFile } from '../../utils/fileUploadUtils';

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10, // MB
  onFilesChange,
  disabled = false,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = accept ? accept.split(',').map(type => type.trim()) : [];

  const validateFiles = (fileList: File[]): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileList.forEach(file => {
      if (!validateFileSize(file, maxSize)) {
        newErrors.push(`${file.name}: File size exceeds ${maxSize}MB`);
        return;
      }

      if (!validateFileType(file, acceptedTypes)) {
        newErrors.push(`${file.name}: File type not supported`);
        return;
      }

      validFiles.push(file);
    });

    return { validFiles, errors: newErrors };
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    const { validFiles, errors: validationErrors } = validateFiles(newFiles);

    if (multiple) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    } else {
      setFiles(validFiles.slice(0, 1));
      onFilesChange(validFiles.slice(0, 1));
    }

    setErrors(validationErrors);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200
          ${dragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {acceptedTypes.length > 0 && `Accepted: ${acceptedTypes.join(', ')}`}
          {maxSize && ` • Max size: ${maxSize}MB`}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Selected Files ({files.length})
          </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {isImageFile(file) ? (
                  <Image className="w-5 h-5 text-blue-500" />
                ) : (
                  <File className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};