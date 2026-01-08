/**
 * Componente de Diagnóstico de Conexão Backend
 * Use este componente para testar a conexão com o backend visualmente
 */

import React, { useState, useEffect } from 'react';
import { testBackendConnection, testAllEndpoints, findBackendUrl, EndpointTest } from '@/utils/testConnection';

export const BackendDiagnostics: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [foundUrl, setFoundUrl] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState<EndpointTest[]>([]);
  const [testing, setTesting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'Não configurado';

  const runTests = async () => {
    setTesting(true);
    
    // Teste 1: Conexão básica
    const connected = await testBackendConnection();
    setIsConnected(connected);
    
    // Teste 2: Encontrar URL se não conectado
    if (!connected) {
      const url = await findBackendUrl();
      setFoundUrl(url);
    }
    
    // Teste 3: Testar endpoints
    const results = await testAllEndpoints();
    setEndpoints(results);
    
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const successful = endpoints.filter(e => e.status === 'success').length;
  const failed = endpoints.filter(e => e.status === 'error').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🏥 Diagnóstico de Conexão Backend
      </h2>

      {/* URL Configurada */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">📋 URL Configurada</h3>
        <code className="text-sm bg-gray-200 px-2 py-1 rounded">{apiUrl}</code>
      </div>

      {/* Status de Conexão */}
      <div className="mb-6 p-4 rounded-lg border-2" style={{
        backgroundColor: isConnected === null ? '#fef3c7' : isConnected ? '#d1fae5' : '#fee2e2',
        borderColor: isConnected === null ? '#fbbf24' : isConnected ? '#10b981' : '#ef4444'
      }}>
        <h3 className="font-semibold mb-2">
          {isConnected === null && '⏳ Testando conexão...'}
          {isConnected === true && '✅ Backend Conectado'}
          {isConnected === false && '❌ Backend Não Conectado'}
        </h3>
        
        {isConnected === false && foundUrl && (
          <div className="mt-2 p-3 bg-white rounded border border-yellow-400">
            <p className="text-sm font-semibold text-yellow-800">💡 Backend encontrado em:</p>
            <code className="text-sm">{foundUrl}</code>
            <p className="text-xs mt-2 text-gray-600">
              Atualize o arquivo <code>.env</code> com: <code>VITE_API_URL={foundUrl}/api</code>
            </p>
          </div>
        )}
      </div>

      {/* Resumo de Endpoints */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">{successful}</div>
          <div className="text-sm text-gray-600">Sucesso</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <div className="text-3xl font-bold text-red-600">{failed}</div>
          <div className="text-sm text-gray-600">Falhas</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{endpoints.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={runTests}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {testing ? '🔄 Testando...' : '🔄 Testar Novamente'}
        </button>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          {showDetails ? '👁️ Ocultar Detalhes' : '👁️ Mostrar Detalhes'}
        </button>
      </div>

      {/* Detalhes dos Endpoints */}
      {showDetails && (
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">🧪 Detalhes dos Endpoints</h3>
          <div className="space-y-2">
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded border"
                style={{
                  backgroundColor: endpoint.status === 'success' ? '#f0fdf4' : '#fef2f2',
                  borderColor: endpoint.status === 'success' ? '#86efac' : '#fca5a5'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {endpoint.status === 'success' ? '✅' : '❌'}
                  </span>
                  <div>
                    <div className="font-mono text-sm">
                      <span className="font-semibold">{endpoint.method}</span> {endpoint.endpoint}
                    </div>
                    {endpoint.message && (
                      <div className="text-xs text-gray-600">{endpoint.message}</div>
                    )}
                  </div>
                </div>
                {endpoint.statusCode && (
                  <span className="px-2 py-1 bg-white rounded text-sm font-mono">
                    {endpoint.statusCode}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dicas */}
      {failed > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-2">💡 Dicas de Troubleshooting</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>1. ✅ Verifique se o backend está rodando em <code>http://localhost:3000</code></li>
            <li>2. 🌐 Verifique se CORS está configurado no backend</li>
            <li>3. 🛣️ Verifique se os endpoints existem no backend</li>
            <li>4. ⚙️ Verifique o arquivo <code>.env</code> e reinicie o servidor frontend</li>
            <li>5. 🔑 Alguns endpoints podem precisar de autenticação</li>
          </ul>
        </div>
      )}
    </div>
  );
};
