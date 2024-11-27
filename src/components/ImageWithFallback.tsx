"use client";

import { ImageProps } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageWithFallbackProps = {
  fallbackSrc: ImageProps["src"];
} & ImageProps;

export const ImageWithFallback = ({
  fallbackSrc,
  src,
  alt,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={() => setError(true)}
      src={error ? fallbackSrc : src}
      {...props}
    />
  );
};
