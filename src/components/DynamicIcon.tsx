import * as Icons from 'lucide-react';
import { ElementType } from 'react';

type IconName = keyof typeof Icons;

interface DynamicIconProps {
  name?: string | null;
  className?: string;
}

const DynamicIcon = ({ name, className = "h-5 w-5" }: DynamicIconProps) => {
  if (!name) return null;

  const iconName = name as IconName;
  const IconComponent = Icons[iconName] as ElementType; 

  if (!IconComponent) return null;

  return <IconComponent className={className} />;
};

export default DynamicIcon;