import prismadb from '@/lib/prismadb';
import React from 'react';

const buildPc = async () => {
  try {
    const profiles = await prismadb.compatibiltyProfile.findMany({
      // Specify your query parameters here
      include: {
        cases: true,
        CPUs:true,
     
        GPUs:true,
        motherboards:true,
        powersupplys:true,
        RAMs: { include: { Components: true } },
        disks: { include: { Components: true } },
        
      }
    })

    return (
      <div>
        
      </div>
    );
  } catch (error) {
    console.error('Error fetching compatibility profiles:', error);
    // Handle the error as needed
    return <div>Error loading profiles</div>;
  }
};

export default buildPc;
