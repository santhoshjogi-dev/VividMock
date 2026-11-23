// Same-origin API base (proxied to Spring Boot by nginx in production).
// Override with VITE_API_URL; falls back to the local backend in dev.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080/api" : "/api");
