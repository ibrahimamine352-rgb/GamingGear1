"use client";

import { useEffect, useState } from "react";


const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'TND',
  maximumFractionDigits:0,
  
});
interface CurrencyProps {
  value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({
  value = 0
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return ( 
    <div className="font-semibold "><div className="mx-2">
    {formatter.format(Number(value)).replace("TND","")+" TND "} &nbsp; </div> 
    </div>
  );
}

export default Currency;
