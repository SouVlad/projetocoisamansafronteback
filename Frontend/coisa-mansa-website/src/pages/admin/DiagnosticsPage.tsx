/**
 * Página de Diagnósticos
 * Acesse /admin/diagnostics para ver esta página
 */

import React from 'react';
import { BackendDiagnostics } from '@/components/admin/BackendDiagnostics';

export const DiagnosticsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackendDiagnostics />
      
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">🧪 Como Usar o Console</h3>
          <p className="text-sm mb-3">
            Abra o console do navegador (F12) e execute:
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div>// Importar e executar diagnóstico completo</div>
            <div className="mt-2">
              import &#123; runDiagnostics &#125; from './utils/testConnection';
            </div>
            <div>await runDiagnostics();</div>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            Ou cole diretamente no console (substitua o import pela função):
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm mt-2">
            <div>
              fetch('http://localhost:3000').then(r =&gt; console.log('✅ Backend OK'))
            </div>
            <div>.catch(e =&gt; console.log('❌ Backend offline'))</div>
          </div>
        </div>
      </div>
    </div>
  );
};
