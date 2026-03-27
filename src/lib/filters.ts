import { Prisma } from "@prisma/client";

export function buildProductFilters(params: URLSearchParams) {
  const where: any = {};
  let orderBy: any = { createdAt: 'desc' };

  // ✅ category (ADDED - you were missing this)
  const categoryId = params.get('categoryId');
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // ✅ featured
  if (params.get('isFeatured') === 'true') {
    where.isFeatured = true;
  }

  // ✅ archived (default = false)
  if (params.get('isArchived')) {
    where.isArchived = params.get('isArchived') === 'true';
  } else {
    where.isArchived = false;
  }

  // ✅ price (Decimal safe)
  const min = params.get('minPrice');
  const max = params.get('maxPrice');

  if (min || max) {
    where.price = {};
    if (min) where.price.gte = new Prisma.Decimal(min);
    if (max) where.price.lte = new Prisma.Decimal(max);
  }

  // ✅ availability (FULL system)
  const availability = params.get('availability');

if (availability === 'out_of_stock') {
  where.outOfStock = true;
}

if (availability === 'in_stock') {
  where.outOfStock = false;
}

if (availability === 'coming_soon') {
  where.comingSoon = true;
}

  // ✅ sorting
  const sort = params.get('sort');

  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'name_asc') orderBy = { name: 'asc' };
  if (sort === 'name_desc') orderBy = { name: 'desc' };
  if (sort === 'date_asc') orderBy = { createdAt: 'asc' };
  if (sort === 'date_desc') orderBy = { createdAt: 'desc' };

  return { where, orderBy };
}