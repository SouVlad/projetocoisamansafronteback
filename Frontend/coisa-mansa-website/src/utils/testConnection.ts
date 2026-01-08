/**
 * Utilitário para testar conexão com o backend
 * Use este arquivo para verificar se o backend está acessível
 */

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface EndpointTest {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
  statusCode?: number;
}

/**
 * Testa se o backend está acessível
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    // Tenta acessar a URL base (sem /api primeiro)
    const baseUrl = BACKEND_URL.replace('/api', '');
    const response = await fetch(baseUrl, { method: 'GET' });
    console.log('✅ Backend acessível:', baseUrl, '- Status:', response.status);
    return true;
  } catch (error) {
    console.error('❌ Backend não acessível:', error);
    return false;
  }
}

/**
 * Testa um endpoint específico
 */
export async function testEndpoint(endpoint: string, method: string = 'GET'): Promise<EndpointTest> {
  const url = `${BACKEND_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, { 
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      endpoint,
      method,
      status: response.ok ? 'success' : 'error',
      message: response.ok ? 'OK' : `Erro ${response.status}`,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      endpoint,
      method,
      status: 'error',
      message: error.message || 'Erro de conexão',
    };
  }
}

/**
 * Testa todos os endpoints esperados
 */
export async function testAllEndpoints(): Promise<EndpointTest[]> {
  const endpoints = [
    // Auth endpoints
    { endpoint: '/auth/login', method: 'POST' },
    { endpoint: '/auth/register', method: 'POST' },
    { endpoint: '/auth/me', method: 'GET' },
    
    // Events endpoints
    { endpoint: '/events', method: 'GET' },
    
    // Gallery endpoints
    { endpoint: '/gallery', method: 'GET' },
    
    // Contact endpoints
    { endpoint: '/contact', method: 'POST' },
    
    // Products endpoints
    { endpoint: '/products', method: 'GET' },
  ];

  console.log('🔍 Testando endpoints do backend...');
  
  const results: EndpointTest[] = [];
  
  for (const { endpoint, method } of endpoints) {
    const result = await testEndpoint(endpoint, method);
    results.push(result);
    
    if (result.status === 'success') {
      console.log(`✅ ${method} ${endpoint} - Status: ${result.statusCode}`);
    } else {
      console.log(`❌ ${method} ${endpoint} - ${result.message}`);
    }
  }
  
  return results;
}

/**
 * Testa múltiplas URLs base para encontrar a correta
 */
export async function findBackendUrl(): Promise<string | null> {
  const possibleUrls = [
    'http://localhost:3000',
    'http://localhost:3000/api',
    'http://localhost:8000',
    'http://localhost:8000/api',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3000/api',
  ];

  console.log('🔍 Procurando URL correta do backend...');

  for (const url of possibleUrls) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok || response.status === 404) { // 404 também indica que o servidor está ativo
        console.log(`✅ Backend encontrado em: ${url}`);
        return url;
      }
    } catch (error) {
      // Continua testando
    }
  }

  console.log('❌ Backend não encontrado em nenhuma URL');
  return null;
}

/**
 * Exibe diagnóstico completo no console
 */
export async function runDiagnostics(): Promise<void> {
  console.log('🏥 === DIAGNÓSTICO DE CONEXÃO BACKEND === 🏥');
  console.log('');
  
  // 1. Verifica URL configurada
  console.log('📋 URL Configurada:', BACKEND_URL);
  console.log('');
  
  // 2. Testa conexão básica
  console.log('🔌 Testando conexão básica...');
  const isConnected = await testBackendConnection();
  console.log('');
  
  if (!isConnected) {
    // Tenta encontrar a URL correta
    console.log('🔍 Tentando encontrar URL correta...');
    const foundUrl = await findBackendUrl();
    
    if (foundUrl) {
      console.log(`💡 Sugestão: Altere o .env para: VITE_API_URL=${foundUrl}/api`);
    }
    console.log('');
  }
  
  // 3. Testa endpoints
  console.log('🧪 Testando endpoints...');
  const results = await testAllEndpoints();
  console.log('');
  
  // 4. Sumário
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  
  console.log('📊 === SUMÁRIO === 📊');
  console.log(`✅ Sucesso: ${successful}`);
  console.log(`❌ Falha: ${failed}`);
  console.log(`📝 Total: ${results.length}`);
  console.log('');
  
  if (failed > 0) {
    console.log('💡 DICAS:');
    console.log('1. Verifique se o backend está rodando');
    console.log('2. Verifique CORS no backend');
    console.log('3. Verifique se os endpoints existem');
    console.log('4. Verifique o .env (VITE_API_URL)');
  }
}
