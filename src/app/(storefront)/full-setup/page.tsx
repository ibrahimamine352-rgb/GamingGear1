import prismadb from "@/lib/prismadb";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

async function getFullSetupProducts() {
  const cat = await prismadb.category.findFirst({
    where: { name: "Full Setup" },
    select: { id: true },
  });
  if (!cat) return [];

  return prismadb.product.findMany({
    where: { isArchived: false, categoryId: cat.id },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
}

export default async function FullSetupPage() {
  const products = await getFullSetupProducts();

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 pt-24 pb-10">
      <header className="mb-4">
        <h1 className="text-[20px] md:text-3xl font-semibold text-foreground leading-tight tracking-tight">
          Full Setup Bundles
        </h1>
        <p className="mt-1 text-sm md:text-base text-muted-foreground">
          Pre-built, ready-to-use desktop + peripherals bundles curated by Gaming Gear TN.
        </p>
      </header>

      {!products.length ? (
        <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground bg-card">
          No Full Setup bundles yet. Create some in the admin and they’ll show here automatically.
        </div>
      ) : (
        <section className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const img = p.images?.[0]?.url ?? "/placeholder.png";
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group rounded-2xl border border-border bg-card hover:border-accent hover:shadow-xl transition p-4"
                >
                  <div className="relative md:aspect-square aspect-[4/3] overflow-hidden rounded-xl mb-4">
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-foreground font-medium line-clamp-2">
                        {p.name}
                      </div>
                      <div className="text-sm text-zinc-400">TND {p.price.toString()}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
