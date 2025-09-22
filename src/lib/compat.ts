// Types you already have—adjust field names to your schema:
type CPU = { socket: string; tdp?: number; generation?: string };
type Motherboard = { socket: string; ddrType: string; formFactor: string; chipset?: { name: string, cpus?: string[] } };
type RAM = { type: string; sticks: number; perStickGb: number; speedMt: number };
type GPU = { lengthMm?: number; tbp?: number; pciePower?: { eightPin?: number; hpwr12?: boolean } };
type Case = { maxGpuLengthMm?: number; maxCoolerHeightMm?: number; psuFormFactor?: "ATX"|"SFX"; supportedFormFactors: string[] };
type PSU = { watt: number; formFactor?: "ATX"|"SFX"; pciePower?: { eightPin?: number; hpwr12?: boolean } };

export type Selected = {
  cpu?: CPU; motherboard?: Motherboard; ram?: RAM;
  gpu?: GPU; case?: Case; psu?: PSU;
};

export function isCpuOkWithBoard(cpu: CPU, mb: Motherboard) {
  if (cpu.socket && mb.socket && cpu.socket !== mb.socket) return false;
  // Optional: enforce chipset support lists if available
  if (mb.chipset?.cpus?.length && cpu.generation && !mb.chipset.cpus.includes(cpu.generation)) return false;
  return true;
}

export function isRamOkWithBoard(ram: RAM, mb: Motherboard) {
  if (ram.type && mb.ddrType && ram.type !== mb.ddrType) return false;
  return true;
}

export function isBoardOkWithCase(mb: Motherboard, c: Case) {
  return c.supportedFormFactors?.includes(mb.formFactor);
}

export function isGpuOkWithCase(gpu: GPU, c: Case) {
  return !gpu.lengthMm || !c.maxGpuLengthMm || gpu.lengthMm <= c.maxGpuLengthMm;
}

export function isPsuOkForBuild(psu: PSU, sel: Selected) {
  const need = (sel.cpu?.tdp ?? 0) + (sel.gpu?.tbp ?? 0) + 150; // headroom
  if (psu.watt < need) return false;
  // Connector sanity (very rough)
  if (sel.gpu?.pciePower?.hpwr12) return !!psu.pciePower?.hpwr12;
  if ((sel.gpu?.pciePower?.eightPin ?? 0) > (psu.pciePower?.eightPin ?? 0)) return false;
  if (sel.case?.psuFormFactor && psu.formFactor && sel.case.psuFormFactor !== psu.formFactor) return false;
  return true;
}
