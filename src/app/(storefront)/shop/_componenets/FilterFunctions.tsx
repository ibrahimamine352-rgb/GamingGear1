import { FilterList } from "../page";


export const addmotherboardFitlters=(decodedFilterList:FilterList)=>{





    const whereClause: Record<string, any> = {
        motherboard: {
          some: {},
        },
      };

      const motherboardFilters = []; 
    
      const chipsetFilter = decodedFilterList.motherboardchipset;
      if (chipsetFilter && chipsetFilter.length > 0) {
        motherboardFilters.push({
          chipset: {
            name: {
              in: decodedFilterList.motherboardchipset.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardcpusupportFilter = decodedFilterList.motherboardcpusupport;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        motherboardFilters.push({
          cpusupport: {
            name: {
              in: decodedFilterList.motherboardcpusupport.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardformatFilter = decodedFilterList.motherboardformat;
      if (motherboardformatFilter && motherboardformatFilter.length > 0) {
        motherboardFilters.push({
          format: {
            name: {
              in: decodedFilterList.motherboardformat.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardmanufacturerFilter = decodedFilterList.motherboardmanufacturer;
      if (motherboardmanufacturerFilter && motherboardmanufacturerFilter.length > 0) {
        motherboardFilters.push({
          manufacturer: {
            name: {
              in: decodedFilterList.motherboardmanufacturer.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardramslotsFilter = decodedFilterList.motherboardramslots;
      if (motherboardramslotsFilter && motherboardramslotsFilter.length > 0) {
        motherboardFilters.push({
          ramslots: {
            name: {
              in: decodedFilterList.motherboardramslots.map(item => item.searchKey),
            },
          },
        });
      }
    
      if (motherboardFilters.length > 0) {
        whereClause.motherboard = {
          some: {
            AND: motherboardFilters,
          },
        };
      }
    
    return{
       data: whereClause.motherboard
    }
}
export const addcpuFitlters=(decodedFilterList:FilterList)=>{





    const whereClause: Record<string, any> = {
        cpus: {
          some: {},
        },
      };
      const cpuFilters = [];
      const chipsetFilter = decodedFilterList.cPUSupport;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          cpusupport: {
            name: {
              in: decodedFilterList.cPUSupport.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardcpusupportFilter = decodedFilterList.processorModel;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        cpuFilters.push({
          processorModel: {
            name: {
              in: decodedFilterList.processorModel.map(item => item.searchKey),
            },
          },
        });
      }
 
     
      if (cpuFilters.length > 0) {
        whereClause.cpus = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
    return{
       data: whereClause.cpus
    }
}
export const addgpuitlters=(decodedFilterList:FilterList)=>{





    const whereClause: Record<string, any> = {
        gpus: {
          some: {},
        },
      };
      const cpuFilters = [];
   
      const chipsetFilter = decodedFilterList.gpuArchBrand;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
            gpuArchBrand: {
            name: {
              in: decodedFilterList.gpuArchBrand.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardgpusupportFilter = decodedFilterList.gpuBrand;
      if (motherboardgpusupportFilter && motherboardgpusupportFilter.length > 0) {
        cpuFilters.push({
          gpuBrand: {
            name: {
              in: decodedFilterList.gpuBrand.map(item => item.searchKey),
            },
          },
        });
      }
      const graphiccardName = decodedFilterList.graphiccardName;
      if (graphiccardName && graphiccardName.length > 0) {
        cpuFilters.push({
          graphiccardName: {
            name: {
              in: decodedFilterList.graphiccardName.map(item => item.searchKey),
            },
          },
        }); 
      }

     
      if (cpuFilters.length > 0) {
        whereClause.gpus = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
    
    return{
       data: whereClause.gpus
    }
}
export const addRamFitlters=(decodedFilterList:FilterList)=>{





  const whereClause: Record<string, any> = {
    memories: {
        some: {},
      },
    };
    const memoryFilters = [];
    
    const motherboardcpusupportFilter = decodedFilterList.memoryFrequency;
    if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
      memoryFilters.push({
        frequency: {
          name: {
            in: decodedFilterList.memoryFrequency.map(item => item.searchKey),
          },
        },
      });
    }
  
    const motherboardformatFilter = decodedFilterList.memoryNumber;
    if (motherboardformatFilter && motherboardformatFilter.length > 0) {
      memoryFilters.push({
        number: {
          number: {
            in: decodedFilterList.memoryNumber.map(item => parseInt(item.searchKey.replace(' Gb',''))),
          },
        },
      });
    }
  
    const motherboardmanufacturerFilter = decodedFilterList.memoryType;
    if (motherboardmanufacturerFilter && motherboardmanufacturerFilter.length > 0) {
      memoryFilters.push({
        type: {
          name: {
            in: decodedFilterList.memoryType.map(item => item.searchKey),
          },
        },
      });
    }
  
    const memoryMarqueFilter = decodedFilterList.memoryMarque;
    if (memoryMarqueFilter && memoryMarqueFilter.length > 0) {
      memoryFilters.push({
        marque: {
          name: {
            in: decodedFilterList.memoryMarque.map(item => item.searchKey),
          },
        },
      });
    }
  
    if (memoryFilters.length > 0) {
      whereClause.memories = {
        some: {
          AND: memoryFilters,
        },
      };
    }
  
  
  
  return{
     data: whereClause.memories
  }
}
export const addHardDiskFitlters=(decodedFilterList:FilterList)=>{





  const whereClause: Record<string, any> = {
    storages: {
        some: {},
      },
    };
    const memoryFilters = [];
    
      const motherboardcpusupportFilter = decodedFilterList.harddiskBrand;
      if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
        memoryFilters.push({
          brand: {
            name: {
              in: decodedFilterList.harddiskBrand.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardformatFilter = decodedFilterList.harddiskCapacity;
      if (motherboardformatFilter && motherboardformatFilter.length > 0) {
        memoryFilters.push({
          capacity: {
            name: {
              in: decodedFilterList.harddiskCapacity.map(item => parseInt(item.searchKey.replace(' Gb',''))),
            },
          },
        });
      }
    
      const motherboardmanufacturerFilter = decodedFilterList.harddiskComputerinterface;
      if (motherboardmanufacturerFilter && motherboardmanufacturerFilter.length > 0) {
        memoryFilters.push({
          Computerinterface: {
            name: {
              in: decodedFilterList.harddiskComputerinterface.map(item => item.searchKey),
            },
          },
        });
      }
    
      const memoryMarqueFilter = decodedFilterList.harddiskType;
      if (memoryMarqueFilter && memoryMarqueFilter.length > 0) {
        memoryFilters.push({
          type: {
            name: {
              in: decodedFilterList.harddiskType.map(item => item.searchKey),
            },
          },
        });
      }
    
      if (memoryFilters.length > 0) {
        whereClause.storages = {
          some: {
            AND: memoryFilters,
          },
        };
      }
    
  
  
  return{
     data: whereClause.storages
  }
}
export const addCaseFitlters=(decodedFilterList:FilterList)=>{





  const whereClause: Record<string, any> = {
    cases: {
        some: {},
      },
    };
    const cpuFilters = [];
    
    const chipsetFilter = decodedFilterList.pCcaseBrand;
    if (chipsetFilter && chipsetFilter.length > 0) {
      cpuFilters.push({
        brand: {
          name: {
            in: decodedFilterList.pCcaseBrand.map(item => item.searchKey),
          },
        },
      });
    }
  
    const motherboardcpusupportFilter = decodedFilterList.pCcaseCaseformat;
    if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
      cpuFilters.push({
        caseformat: {
          name: {
            in: decodedFilterList.pCcaseCaseformat.map(item => item.searchKey),
          },
        },
      });
    }
    const pCcaseNumberofFansPreinstalled = decodedFilterList.pCcaseNumberofFansPreinstalled;
    if (pCcaseNumberofFansPreinstalled && pCcaseNumberofFansPreinstalled.length > 0) {
      cpuFilters.push({
        numberofFansPreinstalled: {
          name: {
            in: decodedFilterList.pCcaseNumberofFansPreinstalled.map(item => item.searchKey),
          },
        },
      });
    }
    const pCcaseRGBType = decodedFilterList.pCcaseRGBType;
    if (pCcaseRGBType && pCcaseRGBType.length > 0) {
      cpuFilters.push({
        rGBType: {
          name: {
            in: decodedFilterList.pCcaseRGBType.map(item => item.searchKey),
          },
        },
      });
    }

   
    if (cpuFilters.length > 0) {
      whereClause.cases = {
        some: {
          AND: cpuFilters,
        },
      };
    }
  

  
  
  return{
     data: whereClause.cases
  }
}
export const addPowerFitlters=(decodedFilterList:FilterList)=>{





  const whereClause: Record<string, any> = {
    powersupplies: {
        some: {},
      },
    };
    const cpuFilters = [];
    
    const chipsetFilter = decodedFilterList.powersupplyMarque;
    if (chipsetFilter && chipsetFilter.length > 0) {
      cpuFilters.push({
        Marque: {
          name: {
            in: decodedFilterList.powersupplyMarque.map(item => item.searchKey),
          },
        },
      });
    }
  
    const motherboardcpusupportFilter = decodedFilterList.psCertification;
    if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
      cpuFilters.push({
        certification: {
          name: {
            in: decodedFilterList.psCertification.map(item => item.searchKey),
          },
        },
      });
    }

    if (cpuFilters.length > 0) {
      whereClause.powersupplies = {
        some: {
          AND: cpuFilters,
        },
      };
    }
  

  
  
  return{
     data: whereClause.powersupplies
  }
}
export const addCoolingFitlters=(decodedFilterList:FilterList)=>{





  const whereClause: Record<string, any> = {
    cooling: {
        some: {},
      },
    };
    const cpuFilters = [];
    
    const chipsetFilter = decodedFilterList.coolingMark;
    if (chipsetFilter && chipsetFilter.length > 0) {
      cpuFilters.push({
        CoolingMark: {
          name: {
            in: decodedFilterList.coolingMark.map(item => item.searchKey),
          },
        },
      });
    }
  
    const motherboardcpusupportFilter = decodedFilterList.coolingType;
    if (motherboardcpusupportFilter && motherboardcpusupportFilter.length > 0) {
      cpuFilters.push({
        CoolingType: {
          name: {
            in: decodedFilterList.coolingType.map(item => item.searchKey),
          },
        },
      });
    }
    const pCcaseNumberofFansPreinstalled = decodedFilterList.coolingcPUSupport;
    if (pCcaseNumberofFansPreinstalled && pCcaseNumberofFansPreinstalled.length > 0) {
      cpuFilters.push({
        numberofFansPreinstalled: {
          number: {
            in: decodedFilterList.coolingcPUSupport.map(item => item.searchKey),
          },
        },
      });
    }
    const pCcaseRGBType = decodedFilterList.fansNumber;
    if (pCcaseRGBType && pCcaseRGBType.length > 0) {
      cpuFilters.push({
        FansNumber: {
          name: {
            in: decodedFilterList.fansNumber.map(item => parseInt(item.searchKey)),
          },
        },
      });
    }
  
   
    if (cpuFilters.length > 0) {
      whereClause.cooling = {
        some: {
          AND: cpuFilters,
        },
      };
    }
  

  
  return{
     data: whereClause.cooling
  }
}
export const addScreenFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    screens: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const chipsetFilter = decodedFilterList.mark;
      if (chipsetFilter && chipsetFilter.length > 0) {
        cpuFilters.push({
          Mark: {
            name: {
              in: decodedFilterList.mark.map(item => item.searchKey),
            },
          },
        });
      }
    
      const motherboardscreensupportFilter = decodedFilterList.pouce;
      if (motherboardscreensupportFilter && motherboardscreensupportFilter.length > 0) {
        cpuFilters.push({
          Pouce: {
            name: {
              in: decodedFilterList.pouce.map(item => item.searchKey),
            },
          },
        });
      }
          
      const refreshRate = decodedFilterList.refreshRate;
      if (refreshRate && refreshRate.length > 0) {
        cpuFilters.push({
          RefreshRate: {
            name: {
              in: decodedFilterList.refreshRate.map(item => item.searchKey),
            },
          },
        });
      }
    
      const resolution = decodedFilterList.resolution;
      if (resolution && resolution.length > 0) {
        cpuFilters.push({
          resolution: {
            name: {
              in: decodedFilterList.resolution.map(item => item.searchKey),
            },
          },
        });
      }
      
     
      if (cpuFilters.length > 0) {
        whereClause.screens = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.screens
  }
}
export const addLaptopFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    laptops: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const LapSystem = decodedFilterList.LapSystem;
      if (LapSystem && LapSystem.length > 0) {
        cpuFilters.push({
          System: {
            name: {
              in: LapSystem.map(item => item.searchKey),
            },
          },
        });
      }
      const LapProcesseur = decodedFilterList.LapProcesseur;
      if (LapProcesseur && LapProcesseur.length > 0) {
        cpuFilters.push({
          Processeur: {
            name: {
              in: LapProcesseur.map(item => item.searchKey),
            },
          },
        });
      }
    
      const LapGraphiccard = decodedFilterList.LapGraphiccard;
      if (LapGraphiccard && LapGraphiccard.length > 0) {
        cpuFilters.push({
          Graphiccard: {
            name: {
              in: LapGraphiccard.map(item => item.searchKey),
            },
          },
        });
      }
    
      const LapScreenSize = decodedFilterList.LapScreenSize;
      if (LapScreenSize && LapScreenSize.length > 0) {
        cpuFilters.push({
          ScreenSize: {
            name: {
              in: LapScreenSize.map(item => item.searchKey),
            },
          },
        });
      }
    
      const LapScreenType = decodedFilterList.LapScreenType;
      if (LapScreenType && LapScreenType.length > 0) {
        cpuFilters.push({
          ScreenType: {
            name: {
              in: LapScreenType.map(item => item.searchKey),
            },
          },
        });
      }
    
      const LapHardisk = decodedFilterList.LapHardisk;
      if (LapHardisk && LapHardisk.length > 0) {
        cpuFilters.push({
          Hardisk: {
            name: {
              in: LapHardisk.map(item => item.searchKey),
            },
          },
        });
      }
    
      const Lapmemory = decodedFilterList.Lapmemory;
      if (Lapmemory && Lapmemory.length > 0) {
        cpuFilters.push({
          memory: {
            name: {
              in: Lapmemory.map(item => item.searchKey),
            },
          },
        });
      }
    
      const Lapnetwork = decodedFilterList.Lapnetwork;
      if (Lapnetwork && Lapnetwork.length > 0) {
        cpuFilters.push({
          network: {
            name: {
              in: Lapnetwork.map(item => item.searchKey),
            },
          },
        });
      }
      const LapSound = decodedFilterList.LapSound;
      if (LapSound && LapSound.length > 0) {
        cpuFilters.push({
          Sound: {
            name: {
              in: LapSound.map(item => item.searchKey),
            },
          },
        });
      }
      const LapCamera = decodedFilterList.LapCamera;
      if (LapCamera && LapCamera.length > 0) {
        cpuFilters.push({
          Camera: {
            name: {
              in: LapCamera.map(item => item.searchKey),
            },
          },
        });
      }
    
        const LapRefreshRate = decodedFilterList.LapRefreshRate;
      if (LapRefreshRate && LapRefreshRate.length > 0) {
        cpuFilters.push({
          RefreshRate: {
            name: {
              in: LapRefreshRate.map(item => item.searchKey),
            },
          },
        });
      }
        const manufacturer = decodedFilterList.manufacturer;
      if (manufacturer && manufacturer.length > 0) {
        cpuFilters.push({
          Manufacturer: {
            name: {
              in: manufacturer.map(item => item.searchKey),
            },
          },
        });
      }
    
      if (cpuFilters.length > 0) {
        whereClause.laptops = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.laptops
  }
}
export const addKeyboardFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    laptops: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const manufacturer = decodedFilterList.manufacturer;
      if (manufacturer && manufacturer.length > 0) {
        cpuFilters.push({
          Manufacturer: {
            name: {
              in: manufacturer.map(item => item.searchKey),
            },
          },
        });
      }
      const keyboarFormat = decodedFilterList.keyboarFormat;
      if (keyboarFormat && keyboarFormat.length > 0) {
        cpuFilters.push({
          keyboarFormat: {
            name: {
              in: keyboarFormat.map(item => item.searchKey),
            },
          },
        });
      }
    
      const keyboarTouchType = decodedFilterList.keyboarTouchType;
      if (keyboarTouchType && keyboarTouchType.length > 0) {
        cpuFilters.push({
          keyboarTouchType: {
            name: {
              in: keyboarTouchType.map(item => item.searchKey),
            },
          },
        });
      }
    
      if (cpuFilters.length > 0) {
        whereClause.laptops = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.laptops
  }
}
export const addHeadsetFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    laptops: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const manufacturer = decodedFilterList.manufacturer;
      if (manufacturer && manufacturer.length > 0) {
        cpuFilters.push({
          Manufacturer: {
            name: {
              in: manufacturer.map(item => item.searchKey),
            },
          },
        });
      }
      const headsetModel = decodedFilterList.headsetModel;
      if (headsetModel && headsetModel.length > 0) {
        cpuFilters.push({
          HeadsetModel: {
            name: {
              in: headsetModel.map(item => item.searchKey),
            },
          },
        });
      }
    
      const headsetSonSurround = decodedFilterList.headsetSonSurround;
      if (headsetSonSurround && headsetSonSurround.length > 0) {
        cpuFilters.push({
          HeadsetSonSurround: {
            name: {
              in: headsetSonSurround.map(item => item.searchKey),
            },
          },
        });
      }
         const headsetInterfaceAvecOrdinateur = decodedFilterList.headsetInterfaceAvecOrdinateur;
      if (headsetInterfaceAvecOrdinateur && headsetInterfaceAvecOrdinateur.length > 0) {
        cpuFilters.push({
          HeadsetInterfaceAvecOrdinateur: {
            name: {
              in: headsetInterfaceAvecOrdinateur.map(item => item.searchKey),
            },
          },
        });
      }
      if (cpuFilters.length > 0) {
        whereClause.laptops = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.laptops
  }
}
export const addMouseFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    laptops: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const manufacturer = decodedFilterList.manufacturer;
      if (manufacturer && manufacturer.length > 0) {
        cpuFilters.push({
          Manufacturer: {
            name: {
              in: manufacturer.map(item => item.searchKey),
            },
          },
        });
      }
      const SensorType = decodedFilterList.SensorType;
      if (SensorType && SensorType.length > 0) {
        cpuFilters.push({
          SensorType: {
            name: {
              in: SensorType.map(item => item.searchKey),
            },
          },
        });
      }
    

    
      if (cpuFilters.length > 0) {
        whereClause.laptops = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.laptops
  }
}
export const addMousepadFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    laptops: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const manufacturer = decodedFilterList.manufacturer;
      if (manufacturer && manufacturer.length > 0) {
        cpuFilters.push({
          Manufacturer: {
            name: {
              in: manufacturer.map(item => item.searchKey),
            },
          },
        });
      }
      const mousepadModel = decodedFilterList.mousepadModel;
      if (mousepadModel && mousepadModel.length > 0) {
        cpuFilters.push({
          MousepadModel: {
            name: {
              in: mousepadModel.map(item => item.searchKey),
            },
          },
        });
      }
    
      const mousepadSize = decodedFilterList.mousepadSize;
      if (mousepadSize && mousepadSize.length > 0) {
        cpuFilters.push({
          MousepadSize: {
            name: {
              in: mousepadSize.map(item => item.searchKey),
            },
          },
        });
      }
    
      if (cpuFilters.length > 0) {
        whereClause.laptops = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.laptops
  }
}
export const addMicFitlters=(decodedFilterList:FilterList)=>{

  const whereClause: Record<string, any> = {
    laptops: {
        some: {},
      },
    };
    const cpuFilters = [];
    
      const manufacturer = decodedFilterList.manufacturer;
      if (manufacturer && manufacturer.length > 0) {
        cpuFilters.push({
          Manufacturer: {
            name: {
              in: manufacturer.map(item => item.searchKey),
            },
          },
        });
      }
      const micModel = decodedFilterList.micModel;
      if (micModel && micModel.length > 0) {
        cpuFilters.push({
          MicModel: {
            name: {
              in: micModel.map(item => item.searchKey),
            },
          },
        });
      }
    
      const micInterfaceAvecOrdinateur = decodedFilterList.micInterfaceAvecOrdinateur;
      if (micInterfaceAvecOrdinateur && micInterfaceAvecOrdinateur.length > 0) {
        cpuFilters.push({
          MicInterfaceAvecOrdinateur: {
            name: {
              in: micInterfaceAvecOrdinateur.map(item => item.searchKey),
            },
          },
        });
      }
       
      const micSonSurround = decodedFilterList.micSonSurround;
      if (micSonSurround && micSonSurround.length > 0) {
        cpuFilters.push({
          MicSonSurround: {
            name: {
              in: micSonSurround.map(item => item.searchKey),
            },
          },
        });
      }
    
      if (cpuFilters.length > 0) {
        whereClause.laptops = {
          some: {
            AND: cpuFilters,
          },
        };
      }
    
  
  return{
     data: whereClause.laptops
  }
}