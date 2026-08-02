export interface BrandConfig {
  id: string;
  name: string;
  description: string;
  path: string;
}

export const BRANDS: BrandConfig[] = [
  {
    id: "noblenestsco",
    name: "Noble Nests Co",
    description: "Curating Luxury Properties & High-Return Investment Opportunities.",
    path: "/noblenestsco"
  }
];

export const DEFAULT_BRAND_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/noblenestsco";

export function getBrandPath(path: string) {
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // For the root path, we might just want to return the base path
  if (normalizedPath === '/') return DEFAULT_BRAND_PATH;
  return `${DEFAULT_BRAND_PATH}${normalizedPath}`;
}
