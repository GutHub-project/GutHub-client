import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

interface IconProps {
  name: string;
  width: number;
  height: number;
  color: string;
  style?: string;
}

export default function Icon({ name, width, height, color, style }: IconProps) {
  return (
    <Image
      src={`/images/${name}.svg`}
      alt={name}
      width={width}
      height={height}
      className={twMerge(style, `bg-${color}`)}
    />
  );
}
