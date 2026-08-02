"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deletePropertyAction, toggleFeatureAction, togglePublishAction } from "@/app/[brand]/admin/properties/actions";

export interface PropertyActionsProps {
  propertySlug: string;
  isFeatured: boolean;
  status: string;
}

export function PropertyActions({ propertySlug, isFeatured, status }: PropertyActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await deletePropertyAction(propertySlug);
      if (!res.success) throw new Error(res.error || "Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete property.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFeature = async () => {
    try {
      const res = await toggleFeatureAction(propertySlug, !isFeatured);
      if (!res.success) throw new Error(res.error || "Failed to update feature status");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update property.");
    }
  };

  const togglePublish = async () => {
    try {
      const res = await togglePublishAction(propertySlug, status);
      if (!res.success) throw new Error(res.error || "Failed to update status");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update property.");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/properties/${propertySlug}`} target="_blank">
        <Button variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white">
          View
        </Button>
      </Link>
      
      <Link href={`/admin/properties/${propertySlug}/edit`}>
        <Button variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 hover:bg-white/10 text-white">
          Edit
        </Button>
      </Link>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={togglePublish}
        className={`h-8 text-xs border-white/10 ${status === "Published" ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
      >
        {status === "Published" ? "Unpublish" : "Publish"}
      </Button>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleFeature}
        className={`h-8 text-xs border-white/10 ${isFeatured ? "bg-gold-500/10 text-gold-500 hover:bg-gold-500/20" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
      >
        {isFeatured ? "Unfeature" : "Feature"}
      </Button>
      
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDelete} 
        disabled={isDeleting}
        className="h-8 text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
      >
        {isDeleting ? "..." : "Delete"}
      </Button>
    </div>
  );
}
