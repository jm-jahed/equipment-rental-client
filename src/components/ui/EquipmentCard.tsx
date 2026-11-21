import React from "react";
import Link from "next/link";
import { MapPin, Tag, ArrowRight } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";

export interface EquipmentCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  rentalPrice: number;
  rentalType: "Daily" | "Weekly" | "Monthly";
  location: string;
  availableQuantity: number;
  onViewDetails?: () => void;
  className?: string;
}

export function EquipmentCard({
  id,
  name,
  image,
  category,
  rentalPrice,
  rentalType,
  location,
  availableQuantity,
  onViewDetails,
  className,
}: EquipmentCardProps) {
  const isAvailable = availableQuantity > 0;

  return (
    <div
      className={`group flex flex-col h-full rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden dark:border-slate-800 dark:bg-slate-900 ${className || ""}`}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative w-full h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || "/placeholder-equipment.jpg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="default" className="bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm">
            <Tag className="w-3 h-3 mr-1" />
            {category}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={isAvailable ? "success" : "danger"}>
            {isAvailable ? `In Stock (${availableQuantity})` : "Unavailable"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span className="truncate">{location}</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">
            {name}
          </h3>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Rent for</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ${rentalPrice}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/{rentalType.toLowerCase()}</span>
            </div>
          </div>

          {onViewDetails ? (
            <Button size="sm" variant="primary" onClick={onViewDetails}>
              View Details
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Link href={`/equipment/${id}`}>
              <Button size="sm" variant="primary">
                View Details
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
