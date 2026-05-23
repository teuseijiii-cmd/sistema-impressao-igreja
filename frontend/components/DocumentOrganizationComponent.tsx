
ARQUIVO: 16. frontend/src/components/DocumentOrganizationComponent.tsx<br/>
CAMINHO: frontend/src/components/DocumentOrganizationComponent.tsx<br/>
DESCRIÇÃO: Componente de organização visual dos documentos

import React, { useState, useEffect } from 'react';
import { FiFolder, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { getDocuments } from '../services/api';
import DocumentCard from './DocumentCard';

interface CategoryGroup {
  name: string;<br/>
  documents: any[];<br/>
  icon: string;
}

const DocumentOrganizationComponent: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories: CategoryGroup[] = [<br/>
    { name: 'Escalas', documents: documents.filter(d => d.category === 'Escalas'), icon: '📋' },<br/>
    { name: 'Tarefas', documents: documents.filter(d => d.category === 'Tarefas'), icon: '✅' },<br/>
    { name: 'Louvor', documents: documents.filter(d => d.category === 'Louvor'), icon: '🎵' },<br/>
    { name: 'Mídia', documents: documents.filter(d => d.category === 'Mídia'), icon: '🖥️' },<br/>
    { name: 'Avisos', documents: documents.filter(d => d.category === 'Avisos'), icon: '📢' },<br/>
    { name: 'Cronogramas', documents: documents.filter(d => d.category === 'Cronograma'), icon: '📅' },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barra de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <FiFilter className="text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <FiList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.filter(cat => cat.documents.length > 0 || selectedCategory === 'all').map(category => (
          <div key={category.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {category.documents.length}
              </span>
            </div>

            {/* Documentos da categoria */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
              {category.documents.slice(0, 4).map(doc => (
                <DocumentCard key={doc.id} document={doc} compact={viewMode === 'grid'} />
              ))}
              {category.documents.length > 4 && (
                <p className="text-sm text-blue-600 hover:underline cursor-pointer mt-1">
                  Ver todos ({category.documents.length})
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lista completa (quando filtrada) */}
      {searchTerm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Resultados da busca</h3>
          <div className="space-y-2">
            {filteredDocuments.map(doc => (
              <DocumentCard key={doc.id} document={doc} compact />
            ))}
            {filteredDocuments.length === 0 && (
              <p className="text-gray-500 text-center py-8">Nenhum documento encontrado.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentOrganizationComponent;
