
ARQUIVO: 20. frontend/src/services/api.ts<br/>
CAMINHO: frontend/src/services/api.ts<br/>
DESCRIÇÃO: Funções de comunicação com o backend

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,<br/>
  headers: {<br/>
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funções de Documentos
export const getDocuments = async (params?: { category?: string; month?: string }) => {
  const response = await apiClient.get('/files', { params });
  return response.data;
};

export const uploadFiles = async (files: any[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file.file);
    formData.append('metadata', JSON.stringify(file.metadata));
  });
  const response = await apiClient.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await apiClient.delete(`/files/${id}`);
  return response.data;
};

// Funções de Impressão
export const sendToPrinter = async (documentIds: string[], options: any) => {
  const response = await apiClient.post('/printer/print', { documentIds, options });
  return response.data;
};

export const getPrinterStatus = async () => {
  const response = await apiClient.get('/printer/status');
  return response.data;
};

// Funções de Autenticação
export const loginWithGoogle = async (credential: string) => {
  const response = await apiClient.post('/auth/google', { credential });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  localStorage.removeItem('auth_token');
  return response.data;
};

// Funções do Google Drive
export const syncDriveFolder = async (folderId: string) => {
  const response = await apiClient.post('/drive/sync', { folderId });
  return response.data;
};

export const listDriveFiles = async (folderId: string) => {
  const response = await apiClient.get(`/drive/files/${folderId}`);
  return response.data;
};

// Funções de Categorização
export const classifyDocument = async (fileId: string) => {
  const response = await apiClient.post('/categorizer/classify', { fileId });
  return response.data;
};

export const suggestCategory = async (filename: string) => {
  const response = await apiClient.post('/categorizer/suggest', { filename });
  return response.data;
};

// Funções do painel administrativo
export const getUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const getPrintHistory = async (params?: { startDate?: string; endDate?: string }) => {
  const response = await apiClient.get('/admin/print-history', { params });
  return response.data;
};

export default apiClient;
