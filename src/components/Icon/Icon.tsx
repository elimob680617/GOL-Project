import { useTheme } from '@mui/material';

import IcomoonReact from 'icomoon-react';

import iconLinearSet from './IconLinear.json';
import { LinearIconType, SolidIconType } from './IconNames';
import iconSolidSet from './IconSolid.json';

interface IconProps {
  color?: string;
  size?: string | number;
  type?: 'solid' | 'linear';
  name: SolidIconType | LinearIconType;
  className?: string;
}

const Icon = (props: IconProps) => {
  const { name, size = 24, className, color = 'grey.700', type = 'linear' } = props;
  const theme = useTheme();
  const colorSplit = color.split('.');
  return (
    <IcomoonReact
      className={className}
      iconSet={type === 'linear' ? iconLinearSet : iconSolidSet}
      color={(theme.palette as any)[colorSplit[0]][colorSplit[1]] as string}
      size={size}
      icon={name as string}
    />
  );
};

export default Icon;
