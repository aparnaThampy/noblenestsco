import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function GET() {
  try {
    const properties = await container.propertyService.getAllProperties({ status: "active" });
    
    // Extract unique cities from active properties
    const citiesSet = new Set<string>();
    properties.forEach(p => {
      if (p.location?.city) {
        citiesSet.add(p.location.city);
      }
    });
    
    const locations = Array.from(citiesSet).map(city => ({
      city,
      count: properties.filter(p => p.location?.city === city).length
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
