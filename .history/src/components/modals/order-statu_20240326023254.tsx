"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@nextui-org/react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setstatu: (val:boolean) => void;
  loading: boolean;
  statu: boolean;
  setArchive: (val:boolean) => void;
  Archive:boolean
}

export const OrderStausAlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm, 
  loading,
  setstatu,
  statu,
  setArchive,
  Archive
}) => {
  const [isMounted, setIsMounted] = useState(false);
 

  useEffect(() => {
    setIsMounted(true);
    console.log(Archive)
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Update Status"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      IsPaid  <Checkbox  checked={statu} onChange={()=>setstatu(!statu)}/>
      Archivé  <Checkbox checked={Archive} onChange={()=>setArchive(!Archive)}/>{Archive?<>oui</>:<>non</>}
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
      </div>
    </Modal>
  );
};
