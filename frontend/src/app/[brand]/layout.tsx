import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { notFound } from "next/navigation";
import { BRANDS } from "@/lib/config/brands";
import { FloatingSocialIcons } from "@/components/shared/floating-social-icons";

export default async function BrandLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ brand: string }>;
}>) {
  const { brand } = await params;
  
  // Validate that the brand exists
  const brandConfig = BRANDS.find(b => b.id === brand);
  
  if (!brandConfig && brand !== "noblenestsco") {
    // If the brand is completely unknown, we might want to show a 404
    // But since the current implementation is mostly for noblenestsco, we can just check if it's a valid brand.
    notFound();
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <FloatingSocialIcons />
    </>
  );
}
