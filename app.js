import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'os';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
let connectedClients = 0; // Track the number of connected clients

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  connectedClients++;
  console.log("User has connected");

  socket.on('disconnect', () => {
    connectedClients--;
    console.log("User has disconnected");
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

const getMemoryUsage = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

  return {
    totalMemory: (totalMemory / 1024 / 1024).toFixed(2) + ' MB',
    usedMemory: (usedMemory / 1024 / 1024).toFixed(2) + ' MB',
    freeMemory: (freeMemory / 1024 / 1024).toFixed(2) + ' MB',
    memoryUsagePercentage: memoryUsagePercentage.toFixed(2) + '%',
  };
};

const getCpuUsage = () => {
  const cpus = os.cpus();
  let totalIdle = 0,
    totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;

  const usagePercentage = ((total - idle) / total) * 100;

  return {
    cpuUsagePercentage: usagePercentage.toFixed(2) + '%',
  };
};

const logSystemUsage = () => {
  const memoryUsage = getMemoryUsage();
  const cpuUsage = getCpuUsage();

  console.clear();
  console.log(`Connected clients: ${connectedClients}`);
  console.log(`Memory Usage: ${memoryUsage.memoryUsagePercentage}`);
  console.log(`CPU Usage: ${cpuUsage.cpuUsagePercentage}`);
};

setInterval(logSystemUsage, 1000);

