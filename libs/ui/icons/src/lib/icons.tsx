import { FC } from 'react';
import { AccessibleIcon } from './AccessibleIcon';
import { IconProps } from './variants';
import {
  HiCheck,
  HiOutlineSearch,
  HiOutlineArrowRight,
  HiPlus,
  HiMinus,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlinePlusCircle,
  HiOutlineUserCircle,
  HiOutlineUser,
  HiOutlineUserAdd,
  HiOutlineUsers,
  HiOutlineCalculator,
  HiOutlineSun,
  HiOutlineMoon,
} from 'react-icons/hi';
import {
  HiOutlineArrowUpCircle,
  HiChevronUpDown,
  HiOutlineLanguage,
  HiOutlineCalendarDays,
  HiCalendar,
  HiMagnifyingGlassPlus,
} from 'react-icons/hi2';
import { BiCircle, BiHelpCircle, BiXCircle } from 'react-icons/bi';
import {
  BsTags,
  BsQrCode,
  BsQrCodeScan,
  BsDownload,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { RxMagicWand } from 'react-icons/rx';
import {
  AiFillCheckCircle,
  AiOutlineCheck,
  AiFillInfoCircle,
  AiOutlineCreditCard,
  AiOutlineMail,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from 'react-icons/ai';

import {
  IoWarning,
  IoWarningOutline,
  IoLocationOutline,
  IoChevronBack,
} from 'react-icons/io5';

import {
  MdOutlineError,
  MdOutlineClose,
  MdOutlineNotificationsActive,
  MdOutlineNotificationsNone,
} from 'react-icons/md';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';
import {
  FiAward,
  FiLifeBuoy,
  FiLogOut,
  FiLogIn,
  FiMessageSquare,
  FiSettings,
  FiSmile,
  FiMoreHorizontal,
  FiEdit,
  FiSend,
} from 'react-icons/fi';

import { TbSunMoon } from 'react-icons/tb';

// import and export IconType

import type { IconType as ReactIcon } from 'react-icons';

export type IconType = ReactIcon;

export const Reveal: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RxMagicWand} label={'Reveal'} {...props} />
);

export const ChevronBack: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={IoChevronBack} label={'Go Back'} {...props} />
);

export const SeeDetails: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiMagnifyingGlassPlus}
    label={'See Details'}
    {...props}
  />
);
export const Check: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiCheck} label={'Check'} {...props} />
);

export const OutlineSearch: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineSearch}
    label={'Outline Search'}
    {...props}
  />
);

export const QrCode: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={BsQrCode} label={'Qr Code'} {...props} />
);
export const QrCodeScan: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={BsQrCodeScan}
    label={'Qr Code Scan'}
    {...props}
  />
);

export const MenuActions: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={BsThreeDotsVertical}
    label={'Menu Actions'}
    {...props}
  />
);

export const Download: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={BsDownload} label={'Download'} {...props} />
);

export const OutlineArrowRight: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineArrowRight}
    label={'Outline Arrow Right'}
    {...props}
  />
);

export const Plus: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiPlus} label={'Plus'} {...props} />
);

export const Minus: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiMinus} label={'Minus'} {...props} />
);

export const Language: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineLanguage}
    label={'Language'}
    {...props}
  />
);

export const ChevronDown: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineChevronDown}
    label={'Chevron Down'}
    {...props}
  />
);

export const ChevronRight: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineChevronRight}
    label={'Chevron Right'}
    {...props}
  />
);

export const OutlineCalendarDays: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineCalendarDays}
    label={'Outline Calendar Days'}
    {...props}
  />
);

export const Calendar: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiCalendar} label={'Calendar'} {...props} />
);

export const Circle: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={BiCircle} label={'Circle'} {...props} />
);

export const Calculator: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineCalculator}
    label={'Calculator'}
    {...props}
  />
);

export const Light: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiOutlineSun} label={'Light'} {...props} />
);

export const Dark: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiOutlineMoon} label={'Dark'} {...props} />
);

export const FillWarning: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={IoWarning} label={'Fill Warning'} {...props} />
);

export const OutlineWarning: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={IoWarningOutline}
    label={'Outline Warning'}
    {...props}
  />
);

export const FillSuccess: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={AiFillCheckCircle}
    label={'Fill Success'}
    {...props}
  />
);

export const OutlineSuccess: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={AiOutlineCheck}
    label={'Outline Success'}
    {...props}
  />
);

export const OutlineSuccessCircle: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={AiOutlineCheckCircle}
    label={'Outline Success Circle'}
    {...props}
  />
);

export const Cart: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={AiOutlineShoppingCart}
    label={'Cart'}
    {...props}
  />
);

export const DarkLight: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={TbSunMoon}
    label={'Dark Light Auto'}
    {...props}
  />
);

export const FillInfo: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={AiFillInfoCircle}
    label={'Fill Info'}
    {...props}
  />
);

export const OutlineError: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={MdOutlineError}
    label={'Outline Error'}
    {...props}
  />
);

export const BellRing: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={MdOutlineNotificationsActive}
    label={'Bell Ring'}
    {...props}
  />
);

export const Bell: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={MdOutlineNotificationsNone}
    label={'Bell'}
    {...props}
  />
);

export const FillMoon: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiMoonFill} label={'Fill Moon'} {...props} />
);

export const Sun: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiSunLine} label={'Sun'} {...props} />
);

export const Award: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiAward} label={'Award'} {...props} />
);

export const CreditCard: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={AiOutlineCreditCard}
    label={'Credit Card'}
    {...props}
  />
);

export const LifeBuoy: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiLifeBuoy} label={'Life Buoy'} {...props} />
);

export const LogOut: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiLogOut} label={'Log Out'} {...props} />
);

export const LogIn: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiLogIn} label={'Log In'} {...props} />
);

export const Mail: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={AiOutlineMail} label={'Mail'} {...props} />
);

export const MessageSquare: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={FiMessageSquare}
    label={'Message Square'}
    {...props}
  />
);

export const OutlinePlusCircle: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlinePlusCircle}
    label={'Outline Plus Circle'}
    {...props}
  />
);

export const Menu: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={AiOutlineMenu} label={'Menu'} {...props} />
);

export const Settings: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiSettings} label={'Settings'} {...props} />
);

export const OutlineUserCircle: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineUserCircle}
    label={'Outline User Circle'}
    {...props}
  />
);

export const User: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiOutlineUser} label={'User'} {...props} />
);

export const UserAdd: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineUserAdd}
    label={'User Add'}
    {...props}
  />
);

export const Users: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={HiOutlineUsers} label={'Users'} {...props} />
);

export const Close: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={MdOutlineClose} label={'Close'} {...props} />
);

export const Delete: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={AiOutlineDelete} label={'Delete'} {...props} />
);

export const Send: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiSend} label={'Send'} {...props} />
);

export const Tags: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={BsTags} label={'Tags'} {...props} />
);

export const Edit: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiEdit} label={'Edit'} {...props} />
);

export const MoreHorizontal: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={FiMoreHorizontal}
    label={'More Horizontal'}
    {...props}
  />
);

export const XCircle: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={BiXCircle} label={'X Circle'} {...props} />
);

export const HelpCircle: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={BiHelpCircle}
    label={'Help Circle'}
    {...props}
  />
);

export const ArrowUpCircle: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiOutlineArrowUpCircle}
    label={'Arrow Up Circle'}
    {...props}
  />
);

export const ChevronsUpDown: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={HiChevronUpDown}
    label={'Chevrons Up Down'}
    {...props}
  />
);

export const Smile: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={FiSmile} label={'Smile'} {...props} />
);

export const Location: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={IoLocationOutline}
    label={'Location'}
    {...props}
  />
);
