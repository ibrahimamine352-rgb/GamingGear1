// middleware.ts
export { default } from "next-auth/middleware";

// protect only what you need (example: your admin area)
export const config = {
  matcher: ["/admin/:path*"], // DO NOT include /api/auth or /auth/*
};
