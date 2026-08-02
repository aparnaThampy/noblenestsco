import { container } from "@/backend/di/container";
import { HomepageSectionsManager } from "@/components/admin/homepage-sections-manager";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  const sections = await container.homepageService.getAllSections();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <HomepageSectionsManager brand={brand} initialSections={sections} />
    </div>
  );
}
