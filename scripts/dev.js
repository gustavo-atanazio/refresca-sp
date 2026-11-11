const { spawn } = require('node:child_process');
const path = require('node:path');

const PORT = Number(process.env.PORT) || 3001;
const HEALTH_URL = `http://localhost:${PORT}/health`;
const MAX_ATTEMPTS = 20;
const RETRY_DELAY_MS = 250;

async function isHealthy() {
  try {
    const response = await fetch(HEALTH_URL);

    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (await isHealthy()) return true;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
  }

  return false;
}

async function main() {
  const expoArgs = process.argv.slice(2);
  let server = null;

  if (await isHealthy()) {
    console.log(`Servidor de dados já está em execução na porta ${PORT}.`);
  } else {
    server = spawn(process.execPath, [path.join(__dirname, '..', 'server', 'server.js')], {
      stdio: 'inherit',
      env: { ...process.env, PORT: String(PORT) }
    });

    if (!(await waitForServer())) {
      console.error('Não foi possível iniciar o servidor de dados.');
      server.kill();
      process.exit(1);
    }
  }

  const stopServer = () => {
    if (server && !server.killed) server.kill();
  };

  const expo = spawn(`npx expo ${expoArgs.join(' ')}`, { stdio: 'inherit', shell: true });

  expo.on('exit', (code) => {
    stopServer();
    process.exit(code ?? 0);
  });

  ['SIGINT', 'SIGTERM'].forEach((signal) => process.on(signal, () => {
    expo.kill();
    stopServer();
  }));
}

void main();