import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";
import { useSession } from "next-auth/react";

const SettingsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {



  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm  />
      </div>
    </div>
  );
}

export default SettingsPage;
