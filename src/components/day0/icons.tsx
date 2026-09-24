import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BalanceIcon from '@mui/icons-material/Balance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import GroupsIcon from '@mui/icons-material/Groups';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TollIcon from '@mui/icons-material/Toll';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BarChartIcon from '@mui/icons-material/BarChart';
import RepeatIcon from '@mui/icons-material/Repeat';
import SpaIcon from '@mui/icons-material/Spa';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

// Maps the icon names used in idea/survey/day0-checkin-v2.html (Lucide) to their
// closest @mui/icons-material equivalent, so we don't add a new icon dependency.
export const DAY0_ICONS: Record<string, ComponentType<SvgIconProps>> = {
  footprints: DirectionsWalkIcon,
  dumbbell: FitnessCenterIcon,
  scale: BalanceIcon,
  'plus-circle': AddCircleOutlineIcon,
  lock: LockOutlinedIcon,
  clock: AccessTimeIcon,
  gift: CardGiftcardIcon,
  'calendar-check': EventAvailableIcon,
  bell: NotificationsNoneIcon,
  users: GroupsIcon,
  'line-chart': ShowChartIcon,
  map: MapOutlinedIcon,
  award: EmojiEventsOutlinedIcon,
  'battery-low': BatteryAlertIcon,
  'help-circle': HelpOutlineIcon,
  target: GpsFixedIcon,
  moon: DarkModeOutlinedIcon,
  heart: FavoriteBorderIcon,
  'check-circle': CheckCircleOutlineIcon,
  'circle-dashed': RadioButtonUncheckedIcon,
  'minus-circle': RemoveCircleOutlineIcon,
  'thumbs-down': ThumbDownOffAltIcon,
  unlock: LockOpenIcon,
  'credit-card': CreditCardIcon,
  coins: TollIcon,
  package: Inventory2OutlinedIcon,
  flame: LocalFireDepartmentIcon,
  'bar-chart-3': BarChartIcon,
  repeat: RepeatIcon,
  sprout: SpaIcon,
  'badge-check': VerifiedIcon,
  smartphone: PhoneIphoneIcon,
  'notebook-pen': EditNoteIcon,
  brain: PsychologyAltIcon,
};

export function Day0Icon({ name, ...props }: { name?: string } & SvgIconProps) {
  if (!name) return null;
  const Icon = DAY0_ICONS[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
