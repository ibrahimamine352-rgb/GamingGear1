
import { ImageResponse } from "next/server";

export const size = {
  width: 900,
  height: 450,
};

export const contentType = "image/png";

interface Props {
  params: {
    slug: string;
  };
}

export default async function og({ params }: Props) {
  

  return new ImageResponse(
    (
      <div tw="relative flex items-center justify-center">
      
     azzzzzzzzzz
      </div>
    ),
    size
  );
}