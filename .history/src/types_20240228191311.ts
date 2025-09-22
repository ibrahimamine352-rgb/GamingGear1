import { EntityProfile, PreBuiltPcmodel, pcTemplate } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
  id: string;
  category: Category;
  dicountPrice: number;
  name: string;
  price: number;
  description:string
  images: Image[]
  additionalDetails:Field[] 
  stock:number
};
export interface Productt {
  id: string;
  dicountPrice: Decimal;
  name: string;
  price: Decimal;
  description:string
  images: Image[]
  additionalDetails:Field[] 
  stock:Decimal
};

export interface Image {
  id: string;
  url: string;
}
export interface Field {
  id: string;
  name: string;
  value: string;
}


export interface Category {
  id: string;
  name: string;
};

export interface Size {
  id: string;
  name: string;
  value: string;
};

export interface Color {
  id: string;
  name: string;
  value: string;
};

export interface ProdCol {
  id: string;
  name: string;
  price: number;
  description:string
  images: Image[]
};

export  type Images = {
  id: string;
  productId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export  type Prod = {
  images: Image[];
}

export interface Case {
  product: Prod[];
}
export interface Cooling {
  product: Prod[];
}
export interface Motherboard {
  products: Prod[];
}
export interface Cpu {
  products: Prod[];
}
export interface Gpu {
  products: Prod[];
}
export interface HDD {
  product: Prod[];
}
export interface RAM {
  products: Prod[];
}
export interface Power {
  products: Prod[];
}
export interface PreCustmizedPc{
  PreBuiltPcmodel: {
    pcTemplate:{
      caseId: EntityProfile[],
      processorId:EntityProfile[],
      cooling:EntityProfile[],
      graphicCardId:EntityProfile[],
      motherBoardId:EntityProfile[],
      powerSupplyId:EntityProfile[],
      ramIdArray: { Components: EntityProfile[],defaultId:string } [];
      hardDiskArray:{ Components: EntityProfile[] ,defaultId:string}[],
      
    }| null;

   
  }| null;
}