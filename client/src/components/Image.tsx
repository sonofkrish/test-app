import { Image as ImageKitImage } from "@imagekit/react";

interface ImageProps {
  src: string;
  className?: string;
  w?: number;
  h?: number;
  alt: string;
}

const Image = ({ src, className, w, h, alt }: ImageProps) => {
  return (
    <ImageKitImage 
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
