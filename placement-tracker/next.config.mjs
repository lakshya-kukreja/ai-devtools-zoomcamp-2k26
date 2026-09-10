import os from 'node:os';

// Automatically allow current WSL / LAN IPs in development
const getDevOrigins = () => {
  const ips = new Set(['localhost', '127.0.0.1']);
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' || net.family === 4) {
        ips.add(net.address);
      }
    }
  }
  return Array.from(ips);
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  allowedDevOrigins: getDevOrigins(),
};

export default nextConfig;
