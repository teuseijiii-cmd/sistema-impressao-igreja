
ARQUIVO: 17. frontend/src/components/PrinterControlComponent.tsx<br/>
CAMINHO: frontend/src/components/PrinterControlComponent.tsx<br/>
DESCRIÇÃO: Componente de controle de impressão

import React, { useState } from 'react';
import { FiPrinter, FiSettings, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { sendToPrinter } from '../services/api';

interface PrintOptions {
  color: boolean;<br/>
  duplex: boolean;<br/>
  copies: number;<br/>
  paperSize: string;
}

interface PrinterControlComponentProps {
  selectedDocuments: string[];<br/>
  onPrintComplete?: () => void;
}

const PrinterControlComponent: React.FC<PrinterControlComponentProps> = ({ selectedDocuments, onPrintComplete }) => {
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    color: true,<br/>
    duplex: true,<br/>
    copies: 1,<br/>
    paperSize: 'A4'
  });
  const [printing, setPrinting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handlePrint = async () => {
    if (!selectedDocuments.length) return;

    setPrinting(true);
    setStatus('idle');
    setStatusMessage('Enviando para impressão...');

    try {
      const result = await sendToPrinter(selectedDocuments, printOptions);
      setStatus('success');
      setStatusMessage(`Impressão concluída! ${result.printedCount} documento(s) enviado(s).`);
      onPrintComplete?.();
    } catch (error) {
      setStatus('error');
      setStatusMessage('Erro ao enviar para impressão. Verifique a conexão com a impressora.');
    } finally {
      setPrinting(false);
    }
  };

  const handlePrintAllMonth = async () => {
    setStatus('idle');
    setStatusMessage('Preparando impressão do mês...');
    // Lógica para selecionar todos os documentos do mês
    // e enviar para impressão
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Controle de Impressão</h2>
        <span className="text-sm text-gray-500">{selectedDocuments.length} documento(s) selecionado(s)</span>
      </div>

      {/* Opções de impressão */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cor</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPrintOptions(prev => ({ ...prev, color: true }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${printOptions.color ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Colorido
            </button>
            <button
              onClick={() => setPrintOptions(prev => ({ ...prev, color: false }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${!printOptions.color ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              P&B
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Frente e Verso</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPrintOptions(prev => ({ ...prev, duplex: true }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${printOptions.duplex ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Sim
            </button>
            <button
              onClick={() => setPrintOptions(prev => ({ ...prev, duplex: false }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${!printOptions.duplex ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Não
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cópias</label>
          <input
            type="number"
            min="1"
            max="99"
            value={printOptions.copies}
            onChange={(e) => setPrintOptions(prev => ({ ...prev, copies: parseInt(e.target.value) || 1 }))}<br/>
            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tamanho do Papel</label>
          <select
            value={printOptions.paperSize}
            onChange={(e) => setPrintOptions(prev => ({ ...prev, paperSize: e.target.value }))}<br/>
            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="Letter">Carta</option>
            <option value="Legal">Ofício</option>
          </select>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePrint}
          disabled={printing || !selectedDocuments.length}
          className={`
            flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white
            transition-all duration-200
            ${printing || !selectedDocuments.length 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-700 hover:bg-blue-800 active:scale-95'}
          `}
        >
          {printing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <FiPrinter className="w-5 h-5" />
          )}
          {printing ? 'Imprimindo...' : 'Imprimir Selecionados'}
        </button>

        <button
          onClick={handlePrintAllMonth}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium
            bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <FiPrinter className="w-5 h-5" />
          Imprimir Tudo do Mês
        </button>
      </div>

      {/* Status */}
      {status !== 'idle' && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status === 'success' ? (
            <FiCheckCircle className="w-5 h-5" />
          ) : (
            <FiAlertTriangle className="w-5 h-5" />
          )}
          <span className="text-sm">{statusMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PrinterControlComponent;
