"use client";

import React from "react";
import Image from "next/image";
import { Trash } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import MbDialog from "./mbDialog";
import { ProdCol } from "@/types";

type Props = {
  value: ProdCol[];
  onChange: (items: ProdCol[]) => void;
  defaultId: string;
  setDefaultId: (id: string) => void;
  items: ProdCol[];
};

const MotherboardCol: React.FC<Props> = ({
  value,
  onChange,
  defaultId,
  setDefaultId,
  items,
}) => {
  const [open, setOpen] = React.useState(false);

  const removeItem = (id: string) => {
    const next = value.filter(v => v.id !== id);
    onChange(next);

    if (defaultId === id && next.length > 0) {
      setDefaultId(next[0].id);
    }
  };

  return (
    <div className="mt-3">
      <div className="grid grid-cols-6 gap-3">
        {value.map(item => (
          <div key={item.id} className="bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="relative aspect-square">
              <Image
                src={item.images[0]?.url}
                alt=""
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute bottom-2 right-2">
                <IconButton
                  icon={<Trash size={18} />}
                  onClick={() => removeItem(item.id)}
                />
              </div>
            </div>

            <div className="p-2 text-center">
              {item.name}
              <br />
              {defaultId === item.id ? (
                <span className="text-red-500">Default</span>
              ) : (
                <button
                  type="button"
                  className="text-green-600"
                  onClick={() => setDefaultId(item.id)}
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}

        <div
          onClick={() => setOpen(true)}
          className="cursor-pointer flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg"
        >
          +
        </div>
      </div>

      <MbDialog
        openDialg={open}
        onClose={setOpen}
        prodList={value}
        handlechange={(next) => onChange([...next])}
        data={items}
      />
    </div>
  );
};

export default MotherboardCol;
