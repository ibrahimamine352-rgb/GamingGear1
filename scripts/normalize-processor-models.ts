// scripts/normalize-processor-models.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function norm(s: string) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

async function getOrCreateModel(name: 'AMD' | 'INTEL') {
  let m = await prisma.processorModel.findFirst({ where: { name } })
  if (!m) m = await prisma.processorModel.create({ data: { name } })
  return m.id
}

async function main() {
  // 1) Ensure only two canonical models exist (or create them)
  const amdId   = await getOrCreateModel('AMD')
  const intelId = await getOrCreateModel('INTEL')

  // 2) Load all processors with a product name we can inspect
  const processors = await prisma.processor.findMany({
    include: { products: { select: { name: true }, take: 1 } },
  })

  let toAMD = 0
  let toINTEL = 0
  let unknown = 0

  for (const p of processors) {
    const name = norm(p.products[0]?.name ?? '')
    // Decide AMD vs INTEL using simple keyword rules
    let targetId: string | null = null

    // AMD keywords
    if (name.includes('ryzen') || name.includes('threadripper') || name.includes('amd')) {
      targetId = amdId
    }

    // INTEL keywords
    if (
      name.includes('intel') ||
      name.includes('core i3') ||
      name.includes('core i5') ||
      name.includes('core i7') ||
      name.includes('core i9') ||
      name.includes('ultra') ||
      name.includes('xeon')
    ) {
      targetId = intelId
    }

    if (!targetId) {
      unknown++
      continue
    }

    if (p.processorModelId !== targetId) {
      await prisma.processor.update({
        where: { id: p.id },
        data: { processorModelId: targetId },
      })
      if (targetId === amdId) toAMD++
      else toINTEL++
    }
  }

  // 3) Delete every ProcessorModel that is NOT AMD/INTEL (after re-pointing)
  await prisma.processorModel.deleteMany({
    where: { name: { notIn: ['AMD', 'INTEL'] } },
  })

  console.log(`✅ Moved to AMD: ${toAMD}`)
  console.log(`✅ Moved to INTEL: ${toINTEL}`)
  console.log(`⚠️  Left unknown (no keyword match): ${unknown}`)
  console.log('✨ Done. Now only AMD/INTEL should remain in ProcessorModel.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
