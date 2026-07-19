import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/theme';

// Illustrative province-outline placeholder shared by the mini-map (one pin)
// and the full map view (all pins) — matches the prototype's miniMapSvg.
const OUTLINE_D = 'M40,40 L260,30 L270,120 L230,180 L240,260 L120,270 L60,220 L30,140 Z';

export function ParkOutlineSvg({ pin }: { pin?: { x: number; y: number } }) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">
      <Path d={OUTLINE_D} fill="none" stroke="#c9c1a4" strokeWidth={2} />
      {pin && <Circle cx={pin.x} cy={pin.y} r={6} fill={colors.rust} />}
    </Svg>
  );
}
