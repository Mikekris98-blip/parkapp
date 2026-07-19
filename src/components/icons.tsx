import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color: string;
}

export function HomeIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DiscoverIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7l2 5-2 5-2-5z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ProfileIcon({ size = 22, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PlusIcon({ size = 20, color }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4}>
      <Path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </Svg>
  );
}
