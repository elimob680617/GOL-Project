import { FC } from 'react';

const Image: FC<{ src: string; alt: string; width?: number | string; height?: number | string }> = ({
  src,
  alt,
  width,
  height,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width ? width : 'default'}
      height={height ? height : 'default'}
      loading="lazy"
      decoding="async"
    />
  );
};

export default Image;
