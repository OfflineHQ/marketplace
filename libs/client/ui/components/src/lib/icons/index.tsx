// WrappedIcons.tsx
import { AccessibleIcon } from './AccessibleIcon';
import { IconProps } from './variants';
import { IconType } from 'react-icons';
import {
  HiCheck,
  HiOutlineSearch,
  HiOutlineArrowRight,
  HiPlus,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlinePlusCircle,
  HiOutlineUser,
  HiOutlineUserAdd,
  HiOutlineUsers,
} from 'react-icons/hi';
import { HiOutlineCalendarDays } from 'react-icons/hi2';
import { BiCircle } from 'react-icons/bi';
import {
  AiFillWarning,
  AiFillCheckCircle,
  AiFillInfoCircle,
  AiOutlineCreditCard,
  AiOutlineMail,
} from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';
import {
  FiAward,
  FiLifeBuoy,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
} from 'react-icons/fi';

const createWrappedIcon =
  (IconComponent: IconType, label: string) => (props: IconProps) =>
    <AccessibleIcon IconComponent={IconComponent} label={label} {...props} />;

export const Check = createWrappedIcon(HiCheck, 'Check');
export const OutlineSearch = createWrappedIcon(HiOutlineSearch, 'Outline Search');
export const OutlineArrowRight = createWrappedIcon(
  HiOutlineArrowRight,
  'Outline Arrow Right'
);
export const Plus = createWrappedIcon(HiPlus, 'Plus');
export const ChevronDown = createWrappedIcon(HiOutlineChevronDown, 'Chevron Down');
export const ChevronRight = createWrappedIcon(HiOutlineChevronRight, 'Chevron Right');
export const OutlineCalendarDays = createWrappedIcon(
  HiOutlineCalendarDays,
  'Outline Calendar Days'
);
export const Circle = createWrappedIcon(BiCircle, 'Circle');
export const FillWarning = createWrappedIcon(AiFillWarning, 'Fill Warning');
export const FillSuccess = createWrappedIcon(AiFillCheckCircle, 'Fill Success');
export const FillInfo = createWrappedIcon(AiFillInfoCircle, 'Fill Info');
export const OutlineError = createWrappedIcon(MdOutlineError, 'Outline Error');
export const FillMoon = createWrappedIcon(RiMoonFill, 'Fill Moon');
export const Sun = createWrappedIcon(RiSunLine, 'Sun');
export const Award = createWrappedIcon(FiAward, 'Award');
export const CreditCard = createWrappedIcon(AiOutlineCreditCard, 'Credit Card');
export const LifeBuoy = createWrappedIcon(FiLifeBuoy, 'Life Buoy');
export const LogOut = createWrappedIcon(FiLogOut, 'Log Out');
export const Mail = createWrappedIcon(AiOutlineMail, 'Mail');
export const MessageSquare = createWrappedIcon(FiMessageSquare, 'Message Square');
export const OutlinePlusCircle = createWrappedIcon(
  HiOutlinePlusCircle,
  'Outline Plus Circle'
);
export const Settings = createWrappedIcon(FiSettings, 'Settings');
export const User = createWrappedIcon(HiOutlineUser, 'User');
export const UserAdd = createWrappedIcon(HiOutlineUserAdd, 'User Add');
export const Users = createWrappedIcon(HiOutlineUsers, 'Users');
