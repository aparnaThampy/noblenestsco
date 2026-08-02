import { container } from "@/backend/di/container";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsService = container.settingsService;
  
  const [contactSettings, socialLinks] = await Promise.all([
    settingsService.getContactSettings(),
    settingsService.getSocialLinks(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide">Settings</h1>
          <p className="text-white/60 mt-1">Configure contact info and social links.</p>
        </div>
      </div>

      <SettingsForm 
        initialContact={contactSettings} 
        initialSocial={socialLinks} 
      />
    </div>
  );
}
