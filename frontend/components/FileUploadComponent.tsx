
ARQUIVO: 15. frontend/src/components/FileUploadComponent.tsx<br/>
CAMINHO: frontend/src/components/FileUploadComponent.tsx<br/>
DESCRIÇÃO: Componente de upload de arquivos com drag & drop

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiCheck } from 'react-icons/fi';
import { uploadFiles } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface FileUploadComponentProps {
  onUploadComplete?: (files: File[]) => void;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { user } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setUploading(true);
    
    const filesToUpload = acceptedFiles.map(file => ({
      file,
      userId: user?.id,<br/>
      metadata: {<br/>
        name: file.name,<br/>
        size: file.size,<br/>
        type: file.type
      }
    }));

    try {
      const result = await uploadFiles(filesToUpload);
      onUploadComplete?.(acceptedFiles);
      // Feedback visual
      acceptedFiles.forEach((file, index) => {
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      });
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  }, [user, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {<br/>
      'application/pdf': ['.pdf'],<br/>
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],<br/>
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-200 
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}<br/>
        ${uploading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <FiUploadCloud className="w-16 h-16 text-blue-500" />
        ) : (
          <FiUploadCloud className="w-16 h-16 text-gray-400" />
        )}
        
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            PDF, DOCX, PNG, JPG, GIF (máx 50MB)
          </p>
        </div>

        {uploading && (
          <div className="w-full max-w-xs">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Enviando arquivos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;
