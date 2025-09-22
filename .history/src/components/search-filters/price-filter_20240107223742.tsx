import React from "react";
import {Slider} from "@nextui-org/react";
import './pricefilter.css'
import { Tooltip} from "@nextui-org/react";
import {InfoIcon} from "./InfoIcon";
import { cn } from "@/lib/utils";
interface PriceFilterProps {
  handlePriceFilter: (values: number[]) => void;
  value: number[];
}
const PriceFilter: React.FC<PriceFilterProps> = ({ handlePriceFilter, value }) => (

  <div className="price-filter-container">
   <Slider
      size="md"
      label="Price Range"
      maxValue={1000}
      step={10}
      defaultValue={[100, 300]}
      formatOptions={{style: "currency", currency: "USD"}}
      classNames={{
        base: "max-w-md gap-3",
        filler: "bg-gradient-to-r from-orange-300 to-grey-300 dark:from-orange-600 dark:to-grey-800",
      }}
      renderLabel={({children, ...props}) => (
        <label {...props} className="text-medium flex gap-2 items-center">
          {children}
          <Tooltip
            className="w-[200px] px-1.5 text-tiny text-default-600 rounded-small"
            content="The price range you want to search for."
            placement="right"
          >
            <span className="transition-opacity opacity-80 hover:opacity-100">
              <InfoIcon />
            </span>
          </Tooltip>
        </label>
      )}
      renderThumb={({index, ...props}) => (
        <div
          {...props}
          className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
        >
          <span
            className={cn(
              "transition-transform bg-gradient-to-br shadow-small rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80",
              index === 0
                ?"from-grey-200 to-grey-600 dark:from-grey-600 dark:to-grey-800"// first thumb
                : "from-orange-200 to-orange-500 dark:from-orange-400 dark:to-orange-600"  , // second thumb
            )}
          />
        </div>
      )}
    />
</div>
  );
  export default PriceFilter;