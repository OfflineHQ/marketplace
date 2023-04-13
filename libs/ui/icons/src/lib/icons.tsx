// WrappedIcons.tsx
import { AccessibleIcon } from './AccessibleIcon';
import { IconProps } from './variants';
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
  HiOutlineCalculator,
} from 'react-icons/hi';
import {
  HiOutlineArrowUpCircle,
  HiChevronUpDown,
  HiOutlineCalendarDays,
  HiCalendar,
} from 'react-icons/hi2';
import { BiCircle, BiHelpCircle, BiXCircle } from 'react-icons/bi';
import { BsTags } from 'react-icons/bs';
import {
  AiFillCheckCircle,
  AiOutlineCheck,
  AiFillInfoCircle,
  AiOutlineCreditCard,
  AiOutlineMail,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineMenu,
} from 'react-icons/ai';

import { IoWarning, IoWarningOutline } from 'react-icons/io5';

import { MdOutlineError, MdOutlineClose } from 'react-icons/md';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';
import {
  FiAward,
  FiLifeBuoy,
  FiLogOut,
  FiMessageSquare,
  FiSettings,
  FiSmile,
  FiMoreHorizontal,
  FiEdit,
} from 'react-icons/fi';

// import and export IconType

import type { IconType as ReactIcon } from 'react-icons';

export type IconType = ReactIcon;

const createWrappedIcon =
  (IconComponent: ReactIcon, label: string) => (props: IconProps) =>
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
export const Calendar = createWrappedIcon(HiCalendar, 'Calendar');
export const Circle = createWrappedIcon(BiCircle, 'Circle');
export const Calculator = createWrappedIcon(HiOutlineCalculator, 'Calculator');
export const FillWarning = createWrappedIcon(IoWarning, 'Fill Warning');
export const OutlineWarning = createWrappedIcon(IoWarningOutline, 'Outline Warning');
export const FillSuccess = createWrappedIcon(AiFillCheckCircle, 'Fill Success');
export const OutlineSuccess = createWrappedIcon(AiOutlineCheck, 'Outline Success');
export const OutlineSuccessCircle = createWrappedIcon(
  AiOutlineCheckCircle,
  'Outline Success Circle'
);
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
export const Menu = createWrappedIcon(AiOutlineMenu, 'Menu');
export const Settings = createWrappedIcon(FiSettings, 'Settings');
export const User = createWrappedIcon(HiOutlineUser, 'User');
export const UserAdd = createWrappedIcon(HiOutlineUserAdd, 'User Add');
export const Users = createWrappedIcon(HiOutlineUsers, 'Users');
export const Close = createWrappedIcon(MdOutlineClose, 'Close');

export const Smile = createWrappedIcon(FiSmile, 'Smile');
export const ChevronsUpDown = createWrappedIcon(HiChevronUpDown, 'Chevrons Up Down');
export const ArrowUpCircle = createWrappedIcon(HiOutlineArrowUpCircle, 'Arrow Up Circle');
export const HelpCircle = createWrappedIcon(BiHelpCircle, 'Help Circle');
export const XCircle = createWrappedIcon(BiXCircle, 'X Circle');
export const MoreHorizontal = createWrappedIcon(FiMoreHorizontal, 'More Horizontal');
export const Edit = createWrappedIcon(FiEdit, 'Edit');
export const Tags = createWrappedIcon(BsTags, 'Tags');

export const Delete = createWrappedIcon(AiOutlineDelete, 'Delete');
