const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3001;
const DATA_DIR = path.join(__dirname, 'data');

const ROUTES = {
  '/sensors': 'sensors.json',
  '/refuges': 'refuges.json',
  '/places': 'places.json',
  '/user-location': 'userLocation.json'
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function sendJSON(response, status, body) {
  response.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

async function handleRequest(request, response) {
  const { pathname } = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, CORS_HEADERS);
    response.end();
    return;
  }

  if (request.method !== 'GET') {
    sendJSON(response, 405, { error: 'Método não permitido' });
    return;
  }

  if (pathname === '/health') {
    sendJSON(response, 200, { status: 'ok' });
    return;
  }

  const fileName = ROUTES[pathname];

  if (!fileName) {
    sendJSON(response, 404, { error: 'Recurso não encontrado' });
    return;
  }

  try {
    const content = await fs.readFile(path.join(DATA_DIR, fileName), 'utf-8');
    sendJSON(response, 200, JSON.parse(content));
  } catch (error) {
    console.error(`Erro ao ler ${fileName}:`, error);
    sendJSON(response, 500, { error: 'Não foi possível carregar os dados' });
  }
}

const server = http.createServer((request, response) => {
  console.log(`${new Date().toISOString()} ${request.method} ${request.url}`);
  void handleRequest(request, response);
});

server.listen(PORT, () => {
  console.log(`Refresca SP API ouvindo na porta ${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));