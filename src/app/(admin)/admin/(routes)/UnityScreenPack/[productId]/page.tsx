import { redirect } from "next/navigation";

export default function UnityScreenPackEditRedirect({
  params,
}: {
  params: { productId: string };
}) {
  redirect(`/admin/CustomPack/${params.productId}`);
}
