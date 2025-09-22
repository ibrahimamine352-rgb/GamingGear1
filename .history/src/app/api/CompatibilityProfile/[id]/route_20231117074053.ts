
import prismadb from '@/lib/prismadb';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const compatibilityProfileId = params.id;
  
      // Find the Compatibility Profile and its associated components
      const compatibilityProfile = await prisma.compatibiltyProfile.findUnique({
        where: { id: compatibilityProfileId },
        include: {
          cases: true,
          CPUs: true,
          disks:  { include: { Components: true } },
          GPUs: true,
          motherboards: true,
          powersupplys: true,
          RAMs: { include: { Components: true } },
        },
      });
  
      if (!compatibilityProfile) {
        return new NextResponse('Compatibility Profile not found', { status: 404 });
      }
  
      // Delete the associated components first
      await prisma.componentOnPc.deleteMany({
        where: {
          OR: [
            { id: { in: compatibilityProfile.motherboards.map((mb) => mb.id) } },
            { id: { in: compatibilityProfile.CPUs.map((cpu) => cpu.id) } },
            { id: { in: compatibilityProfile.GPUs.map((gpu) => gpu.id) } },
            { id: { in: compatibilityProfile.powersupplys.map((psu) => psu.id) } },
            { id: { in: compatibilityProfile.cases.map((pcCase) => pcCase.id) } },
            { id: { in: compatibilityProfile.RAMs.map((ramSlot) => ramSlot.Components.map((ram) => ram.id)).flat() } },
            { id: { in: compatibilityProfile.disks.map((diskSlot) => diskSlot.Components.map((disk) => disk.id)).flat() } },
          ],
        },
      });
  
      // Delete the Compatibility Profile
     const pro= await prisma.compatibiltyProfile.delete({
        where: { id: compatibilityProfileId },
      });
  
      return NextResponse.json(pro);
    } catch (error) {
      console.error('[COMPATIBILITY_PROFILE_DELETE]', error);
      return new NextResponse('Internal error', { status: 500 });
    }
  }

  

export async function PATCH(
    req: Request,
    { params }: { params: { id: string} }
  ) {
    try {
  
        const body = await req.json();
        const { name, motherboardList, processorList, graphicCardList, powersupplyList, ramSlotList, storageList, caseList } = body;
  
        const compatibilityProfileId = params.id;
  
        // Find the Compatibility Profile and its associated components
        const compatibilityProfile = await prisma.compatibiltyProfile.findUnique({
          where: { id: compatibilityProfileId },
          include: {
            cases: true,
            CPUs: true,
            disks:  { include: { Components: true } },
            GPUs: true,
            motherboards: true,
            powersupplys: true,
            RAMs: { include: { Components: true } },
          },
        });



  
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }
  
      if (!compatibilityProfile) {
        return new NextResponse('Compatibility Profile not found', { status: 404 });
      }
  
      // Delete the associated components first
      await prisma.componentOnPc.deleteMany({
        where: {
          OR: [
            { id: { in: compatibilityProfile.motherboards.map((mb) => mb.id) } },
            { id: { in: compatibilityProfile.CPUs.map((cpu) => cpu.id) } },
            { id: { in: compatibilityProfile.GPUs.map((gpu) => gpu.id) } },
            { id: { in: compatibilityProfile.powersupplys.map((psu) => psu.id) } },
            { id: { in: compatibilityProfile.cases.map((pcCase) => pcCase.id) } },
            { id: { in: compatibilityProfile.RAMs.map((ramSlot) => ramSlot.Components.map((ram) => ram.id)).flat() } },
            { id: { in: compatibilityProfile.disks.map((diskSlot) => diskSlot.Components.map((disk) => disk.id)).flat() } },
          ],
        },
      });
  
      // Create a new Compatibility Profile and associated components
      const newCompatibilityProfile = await prisma.compatibiltyProfile.update({
        where:{id:compatibilityProfileId},
        data: {
          name,
          motherboards: {
            create: motherboardList.map((motherboard: string) => ({
              productId:motherboard
            })),
          },
          CPUs: {
            create: processorList.map((cpu: any) => ({
              productId:cpu
            })),
          },
          GPUs: {
            create: graphicCardList.map((gpu: any) => ({
              productId:gpu
            })),
          },
          powersupplys: {
            create: powersupplyList.map((powerSupply: any) => ({
              productId:powerSupply
            })),
          },
          cases: {
            create: caseList.map((pcCase: any) => ({
              productId:pcCase
            })),
          },
          RAMs: {
            create: ramSlotList.map((ramSlot: { rams: any[]; }) => ({
              Components: {
                create: ramSlot.rams.map((ram: any) => ({
                  productId:ram
                })),
              },
              
            })),
          },
          disks: {
            create: storageList.map((storage: { disks: any[]; }) => ({
              Components: {
                create: storage.disks.map((disk: any) => ({
                  productId:disk
                })),
              },
         
            })),
          },
        },
        include: {
          motherboards: true,
          CPUs: true,
          GPUs: true,
          powersupplys: true,
          cases: true,
          RAMs: { include: { rams: true } },
          disks: { include: { disks: true } },
        },
      });
      return NextResponse.json(newCompatibilityProfile);
    } catch (error) {
      console.log('[PRODUCT_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  