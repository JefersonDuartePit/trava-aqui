import type { NextConfig } from "next";

// IPs ou hosts extras que podem abrir o servidor de desenvolvimento, separados por vírgula.
// Na palestra: o IP do Mac na rede da escola, para os celulares abrirem o app em modo dev.
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Gera .next/standalone, usado pela imagem Docker de produção.
  output: "standalone",
  allowedDevOrigins,
  // Plano B do Docker: se a edição de um arquivo não recarregar o app no container,
  // defina WATCH_POLL_MS=1000. Consome mais CPU, então fica desligado por padrão.
  ...(process.env.WATCH_POLL_MS
    ? { watchOptions: { pollIntervalMs: Number(process.env.WATCH_POLL_MS) } }
    : {}),
};

export default nextConfig;
