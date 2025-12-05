"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

// Feel free to replace with your own card component later
export default function FeaturedPrebuiltClient({
  onlyFeatured = false,
  limit = 4,
}: { onlyFeatured?: boolean; limit?: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (onlyFeatured) qs.set("featured", "1");
    fetch(`/api/featured-prebuilt?${qs.toString()}`)
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [onlyFeatured, limit]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-[hsl(var(--card)/0.6)] border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-6 text-center text-zinc-400">
        No builds yet. Add products with <span className="text-foreground">PreBuiltPcmodel</span>
        {onlyFeatured ? " and set isFeatured = true" : ""}.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => {
        const img = p.images?.[0]?.url ?? "/placeholder.png";
        return (
          <Link
  key={p.id}
  href={`/product/${slugify(p.name)}-${p.id}`}
  className="group rounded-2xl border border-border bg-card p-4 hover:border-accent transition"
>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.02] transition" />
            </div>
            <div className="text-foreground font-medium">{p.name}</div>
            <div className="text-sm text-muted-foreground">TND {p.price}</div>
          </Link>
        );
      })}
    </div>
  );
}
