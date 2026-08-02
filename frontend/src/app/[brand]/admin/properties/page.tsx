import { container } from "@/backend/di/container";
import { getBrandPath } from "@/lib/config/brands";
import Link from "next/link";
import { PropertyActions } from "@/components/admin/property-actions";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const propertyService = container.propertyService;
  const properties = await propertyService.getAllProperties();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-wide">Properties</h1>
          <p className="text-white/60 mt-1">Manage investment portfolio and listings.</p>
        </div>
        <Link href={getBrandPath("/admin/properties/new")}>
          <button className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-md font-medium transition-colors">
            Add Property
          </button>
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-white/50 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name & Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-white/60 italic">No properties available.</p>
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white flex items-center space-x-2">
                        <span>{property.title}</span>
                        {property.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-500">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <div className="text-white/50 text-xs mt-1">{property.status} • {property.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{property.location.address}</div>
                      <div className="text-white/50 text-xs mt-1">{property.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{property.price}</div>
                      <div className="text-green-400 text-xs mt-1">ROI: {property.financials.roi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PropertyActions 
                        propertySlug={property.slug} 
                        isFeatured={property.isFeatured || false}
                        status={property.status || "Draft"}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
