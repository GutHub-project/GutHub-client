import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface IconProps {
  path: string;
  width: number;
  height: number;
  color: string;
  style?: string;
}

export default function Icon({ path, width, height, color, style }: IconProps) {
  return (
    <Image
      src={path}
      alt={path.split('/').pop()?.split('.')[0] || 'icon'}
      width={width}
      height={height}
      className={twMerge(style, `bg-${color}`)}
    />
  );
}
