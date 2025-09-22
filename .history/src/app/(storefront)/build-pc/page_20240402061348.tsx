import prismadb from '@/lib/prismadb';
import React from 'react';
import { Motherboard } from './_componenets/Motherboard';
import { BuildForm } from './_componenets/BuildForm';
import { Product } from '@prisma/client';
import { Metadata } from 'next';

export async function generateMetadata():Promise<Metadata> {
return {
  title:"Build Pc",
  description:"Votre escale exclusive pour des PC et périphériques haut de gamme, rehaussant votre expérience informatique avec élégance et performance incomparables."
}
}

export type ProfileType={
  id:string
  cases: Pr[],
  CPUs: Pr[],
  GPUs: Pr[],
  coolings:Pr[],
  motherboards: Pr[],
  powersupplys: Pr[],
  RAMs: { Components: Pr[]  }[],
  disks: { Components: Pr[]  }[],
}

 type Pr={
  productId:String
 }
  export type filterItem={
    id:string,
    name:string,
    number:number
  }
  export type Filter= {
    title:String
    list:filterItem[]
  }
const getprofiles= async ()=>{

  const profiles = await prismadb.compatibiltyProfile.findMany({
    // Specify your query parameters here
    include: {
      cases: true,
      CPUs:true,
      GPUs:true,
      motherboards:true,
      powersupplys:true,
      coolings:true,
      RAMs: { include: { Components: true } },
      disks: { include: { Components: true } },
      
    }
  })
  return profiles as unknown as ProfileType[]
}

const buildPc = async () => {
  try {
   const profiles = await getprofiles()
   const markk =await prismadb.mark.findMany({
    where:{
      screens:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{

        select:{screens:{
          where:{
           products:{some:{isArchived:false}}
          }
        }}
      }
    }
     })

     const mark: Filter = {
      title: "Mark",
      list: markk.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.screens ?? 0,
      
      }
      
      }),
    };
   const poucee =await prismadb.pouce.findMany({
    where:{
      screens:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{screens:{
          where:{
           products:{some:{isArchived:false}}
          }
        }}
      }
    }
     })

     const pouce: Filter = {
      title: "Pouce",
      list: poucee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.screens ?? 0,
      
      }
      
      }),
    };
   const refreshRatee =await prismadb.refreshRate.findMany({
    where:{
      screens:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{screens:{
          where:{
           products:{some:{isArchived:false}}
          }
        }}
      }
    }
     })

     const refreshRate: Filter = {
      title: "Refresh Rate",
      list: refreshRatee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.screens ?? 0,
      
      }
      
      }),
    };
   const resolutionn =await prismadb.resolution.findMany({
    where:{
      screens:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{screens:{
          where:{
           products:{some:{isArchived:false}}
          }
        }}
      }
    }
     })

     const resolution: Filter = {
      title: "Resolution",
      list: resolutionn.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.screens ?? 0,
      
      }
      
      }),
    };
   const graphiccardNamee =await prismadb.graphiccardName.findMany({
    where:{
      motherboards:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{motherboards:{
          where:{
           products:{some:{isArchived:false}}
          }
        }}
      }
    }
     })

     const graphiccardName: Filter = {
      title: "Carte graphique",
      list: graphiccardNamee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.motherboards ?? 0,
      
      }
      
      }),
    };
   const gpuArchBrandd =await prismadb.gpuArchBrand.findMany({
    where:{
      motherboards:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{motherboards:{ where:{
         products:{some:{isArchived:false}}
        }}}
      }
    }
     })

     const gpuArchBrand: Filter = {
      title: "Marque d'achitecture",
      list: gpuArchBrandd.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.motherboards ?? 0,
      
      }
      
      }),
    };
   const gpuBrandd =await prismadb.gpuBrand.findMany({
    where:{
      motherboards:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{motherboards:{ where:{
         products:{some:{isArchived:false}}
        }}}
      }
    }
     })

     const gpuBrand: Filter = {
      title: "Marque",
      list: gpuBrandd.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.motherboards ?? 0,
      
      }
      
      }),
    };
   const coolingcPUSupportt =await prismadb.cPUSupport.findMany({
    where:{
      cooling:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{cooling:{}}
      }
    }
     })

     const coolingcPUSupport: Filter = {
      title: "Support du processeur",
      list: coolingcPUSupportt.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.cooling ?? 0,
      
      }
      
      }),
    };
    const fansNumberr =await prismadb.fansNumber.findMany({
      where:{
        
        cooling:{
          some:{
            product:{some:{isArchived:false}}
          }
        }
      }
      ,include:{
        _count:{
          select:{cooling:{}}
        }
      }
       })
  
       const fansNumber: Filter = {
        title: "Nombre de Ventilateurs Pré-installés",
        list: fansNumberr.map((manufacturer) => {
        return {  
                  id:manufacturer.id,  
          name:manufacturer.number.toString(),
          number: manufacturer._count?.cooling ?? 0,
        
        }
        
        }),
      };
      const coolingTypee =await prismadb.coolingType.findMany({
        where:{
          cooling:{
            some:{
             product:{some:{isArchived:false}}
            }
          }
        }
        ,include:{
          _count:{
            select:{cooling:{}}
          }
        }
         })
    
         const coolingType: Filter = {
          title: "Type",
          list: coolingTypee.map((manufacturer) => {
          return {          id:manufacturer.id,  
        name:manufacturer.name,
            number: manufacturer._count?.cooling ?? 0,
          
          }
          
          }),
        };
   const coolingMarkk =await prismadb.coolingMark.findMany({
    where:{
      cooling:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{cooling:{}}
      }
    }
     })

     const coolingMark: Filter = {
      title: "Marque",
      list: coolingMarkk.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.cooling ?? 0,
      
      }
      
      }),
    };
   const pCcaseRGBTypee =await prismadb.pCcaseRGBType.findMany({
    where:{
      pccase:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{pccase:{}}
      }
    }
     })

     const pCcaseRGBType: Filter = {
      title: "RGB",
      list: pCcaseRGBTypee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.pccase ?? 0,
      
      }
      
      }),
    };
    const pCcaseNumberofFansPreinstalledd =await prismadb.pCcaseNumberofFansPreinstalled.findMany({
      where:{
        pccase:{
          some:{
           product:{some:{isArchived:false}}
          }
        }
      }
      ,include:{
        _count:{
          select:{pccase:{}}
        }
      }
       })
  
       const pCcaseNumberofFansPreinstalled: Filter = {
        title: "Nombre de Ventilateurs Pré-installés",
        list: pCcaseNumberofFansPreinstalledd.map((manufacturer) => {
        return {          id:manufacturer.id,  
        name:manufacturer.name,
          number: manufacturer._count?.pccase ?? 0,
        
        }
        
        }),
      };
   const pCcaseCaseformatt =await prismadb.pCcaseCaseformat.findMany({
    where:{
      pccase:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{pccase:{}}
      }
    }
     })

     const pCcaseCaseformat: Filter = {
      title: "Format du boitier",
      list: pCcaseCaseformatt.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.pccase ?? 0,
      
      }
      
      }),
    };
   const pCcaseBrandd =await prismadb.pCcaseBrand.findMany({
    where:{
      pccase:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{pccase:{}}
      }
    }
     })

     const pCcaseBrand: Filter = {
      title: "Marque",
      list: pCcaseBrandd.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.pccase ?? 0,
      
      }
      
      }),
    };
   const psCertificationn =await prismadb.psCertification.findMany({
    where:{
        powersupplies:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{powersupplies:{}}
      }
    }
     })

     const psCertification: Filter = {
      title: "Certification",
      list: psCertificationn.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.powersupplies ?? 0,
      
      }
      
      }),
    };
   const powersupplyMarquee =await prismadb.powersupplyMarque.findMany({
    where:{
        powersupplies:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{powersupplies:{
          where:{
            products:{some:{isArchived:false}}
           }
        }}
      }
    }
     })

     const powersupplyMarque: Filter = {
      title: "Certification 80+",
      list: powersupplyMarquee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.powersupplies ?? 0,
      
      }
      
      }),
    };
   const harddiskTypee =await prismadb.harddiskType.findMany({
    where:{
        harddisk:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{harddisk:{}}
      }
    }
     })

     const harddiskType: Filter = {
      title: "Type",
      list: harddiskTypee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.harddisk ?? 0,
      
      }
      
      }),
    };
   const harddiskComputerinterfacee =await prismadb.harddiskComputerinterface.findMany({
    where:{
        harddisk:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{harddisk:{}}
      }
    }
     })

     const harddiskComputerinterface: Filter = {
      title: "Interface",
      list: harddiskComputerinterfacee.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.harddisk ?? 0,
      
      }
      
      }),
    };

   const harddiskCapacityy =await prismadb.harddiskCapacity.findMany({
    where:{
        harddisk:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{harddisk:{}}
      }
    }
     })

     const harddiskCapacity: Filter = {
      title: "Capacité",
      list: harddiskCapacityy.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.harddisk ?? 0,
      
      }
      
      }),
    };
   
   const harddiskBrandd =await prismadb.harddiskBrand.findMany({
    where:{
        harddisk:{
        some:{
         product:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{harddisk:{}}
      }
    }
     })

     const harddiskBrand: Filter = {
      title: "Marque",
      list: harddiskBrandd.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.harddisk ?? 0,
      
      }
      
      }),
    };
   const processorModell =await prismadb.processorModel.findMany({
    where:{
      processor:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{processor:{}}
      }
    }
     })

     const processorModel: Filter = {
      title: "Processeur support",
      list: processorModell.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.processor ?? 0,
      
      }
      
      }),
    };
   const cPUSupportt =await prismadb.cPUSupport.findMany({
    where:{
      processor:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{processor:{}}
      }
    }
     })

     const cPUSupport: Filter = {
      title: "Processeur support",
      list: cPUSupportt.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.processor ?? 0,
      
      }
      
      }),
    };
   const memoryFrequencyy =await prismadb.memoryFrequency.findMany({
    where:{
      memoryboards:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }
    ,include:{
      _count:{
        select:{memoryboards:{}}
      }
    }
     })

     const memoryFrequency: Filter = {
      title: "Frequence",
      list: memoryFrequencyy.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.memoryboards ?? 0,
      
      }
      
      }),
    };
     const memoryMarquee =await prismadb.memoryMarque.findMany({
      where:{
        memoryboards:{
          some:{
           products:{some:{isArchived:false}}
          }
        }
      }
      ,include:{
        _count:{
          select:{memoryboards:{}}
        }
      }
       })
       const memoryMarque: Filter = {
        title: "Marque",
        list: memoryMarquee.map((manufacturer) => {
        return {          id:manufacturer.id,  
        name:manufacturer.name,
          number: manufacturer._count?.memoryboards ?? 0,
        
        }
         
        }),
      };
       const memoryNumberr =await prismadb.memoryNumber.findMany({
        where:{
          memoryboards:{
            some:{
             products:{some:{isArchived:false}}
            }
          }
        }
        ,include:{
          _count:{
            select:{memoryboards:{}}
          }
        }
         })
         const memoryNumber: Filter = {
          title: "Capacity",
          list: memoryNumberr.map((manufacturer) => {
          return { 
            id:manufacturer.id,   
            name:manufacturer.number.toString()+" Gb",
            number: manufacturer._count?.memoryboards ?? 0,
          
          }
          
          }),
        };
         const memoryTypee =await prismadb.memoryType.findMany({
          where:{
            memoryboards:{
              some:{
               products:{some:{isArchived:false}}
              }
            }
          }
          ,include:{
            _count:{
              select:{memoryboards:{}}
            }
          }
           })
           const memoryType: Filter = {
            title: "Type",
            list: memoryTypee.map((manufacturer) => {
            return {          id:manufacturer.id,  
        name:manufacturer.name,
              number: manufacturer._count?.memoryboards ?? 0,
            
            }
            
            }),
          };

   const motherboardmanufacturerr =await prismadb.manufacturer.findMany({
  where:{
    motherboards:{
      some:{
       products:{some:{isArchived:false}}
      }
    }
  }
  ,include:{
    _count:{
      select:{motherboards:{}}
    }
  }
   })
   const motherboardmanufacturer: Filter = {
    title: "Marque",
    list: motherboardmanufacturerr.map((manufacturer) => {
    return {          id:manufacturer.id,  
        name:manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    
    }
    
    }),
  };
   const motherboardramslotss =await prismadb.ramSlots.findMany({
  where:{
    motherboards:{
      some:{
       products:{some:{isArchived:false}}
      }

    }
  }  ,include:{
    _count:{
      select:{motherboards:{}}
    }
  }
   })
   const motherboardramslots: Filter = {
    title: "Nombre de barrettes RAM",
    list: motherboardramslotss.map((manufacturer) => {
    return {          id:manufacturer.id,  
        name:manufacturer.name,
      number: manufacturer._count?.motherboards ?? 0,
    
    }
    
    }),
  };
   const motherboardchipsett =await prismadb.motherboardChipset.findMany({
    where:{
      motherboards:{
        some:{
         products:{some:{isArchived:false}}
        }
      }
    }  ,include:{
      _count:{
        select:{motherboards:{}}
      }
    }
     })
     const motherboardchipset: Filter = {
      title: "Chipset de la carte mère",
      list: motherboardchipsett.map((manufacturer) => {
      return {          id:manufacturer.id,  
        name:manufacturer.name,
        number: manufacturer._count?.motherboards ?? 0,
      
      }
      
      }),
    };
     const motherboardcpusupportt =await prismadb.cPUSupport.findMany({
      where:{
        motherboards:{
          some:{
           products:{some:{isArchived:false}}
          }
        }
      }  ,include:{
        _count:{
          select:{motherboards:{}}
        }
      }
       })
       const motherboardcpusupport: Filter = {
        title: "Support du processeur",
        list: motherboardcpusupportt.map((manufacturer) => {
        return {          id:manufacturer.id,  
        name:manufacturer.name,
          number: manufacturer._count?.motherboards ?? 0,
        
        }
        
        }),
      };
       const motherboardformatt =await prismadb.motherboardFormat.findMany({
        where:{
          motherboards:{
            some:{
             products:{some:{isArchived:false}}
            }
          }
        }  ,include:{
          _count:{
            select:{motherboards:{}}
          }
        }
         })
         const motherboardformat: Filter = {
          title: "Format de carte mère",
          list: motherboardformatt.map((manufacturer) => {
          return {          id:manufacturer.id,  
        name:manufacturer.name,
            number: manufacturer._count?.motherboards ?? 0,
          
          }
          
          }),
        };
    return (
      <div>
        <BuildForm 
        mark={mark}
        pouce={pouce}
        refreshRate={refreshRate}
        resolution={resolution}

        gpuArchBrand={gpuArchBrand}
        gpuBrand={gpuBrand}
        graphiccardName={graphiccardName}
        coolingMark={coolingMark}
        coolingType={coolingType}
        coolingcPUSupport={coolingcPUSupport}
        fansNumber={fansNumber}
        pCcaseBrand={pCcaseBrand}
        pCcaseCaseformat={pCcaseCaseformat}
        pCcaseNumberofFansPreinstalled={pCcaseNumberofFansPreinstalled}
        pCcaseRGBType={pCcaseRGBType}
        powersupplyMarque={powersupplyMarque}
        psCertification={psCertification}
        harddiskBrand={harddiskBrand}
        harddiskCapacity={harddiskCapacity}
        harddiskComputerinterface={harddiskComputerinterface}
        harddiskType={harddiskType}
        cPUSupport={cPUSupport}
        processorModel={processorModel}
        memoryFrequency={memoryFrequency}
        memoryMarque={memoryMarque}
        memoryNumber={memoryNumber}
        memoryType={memoryType}
        motherboardchipset={motherboardchipset}
        motherboardcpusupport={motherboardcpusupport}
        motherboardformat={motherboardformat}
        motherboardramslots={motherboardramslots}
        motherboardmanufacturer={motherboardmanufacturer}
         profiles={profiles}/>

      </div>
    );
  } catch (error) {
    console.error('Error fetching compatibility profiles:', error);
    // Handle the error as needed
    return <div>Error loading profiles</div>;
  }
};

export default buildPc;
