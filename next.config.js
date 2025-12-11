/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❗ This makes Next use URLs *without* trailing slash
  // /shop/  -> redirects to /shop
  trailingSlash: false,

  images: {
    domains: ["res.cloudinary.com"],
  },

  async rewrites() {
    return [
      {
        // Pretty URL:  /shop/gpu
        // Internally loads: /shop?categorie=gpu
        source: "/shop/:category",
        destination: "/shop?categorie=:category",
      },
    ];
  },
};

module.exports = nextConfig;
