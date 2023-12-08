import { FC } from 'react';
import {
  AiFillCheckCircle,
  AiFillInfoCircle,
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineCreditCard,
  AiOutlineDelete,
  AiOutlineMail,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from 'react-icons/ai';
import { BiCircle, BiHelpCircle, BiXCircle } from 'react-icons/bi';
import {
  BsCalendarWeek,
  BsCurrencyExchange,
  BsDownload,
  BsQrCode,
  BsQrCodeScan,
  BsTags,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import {
  HiCheck,
  HiMinus,
  HiOutlineArrowRight,
  HiOutlineCalculator,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineMoon,
  HiOutlinePlusCircle,
  HiOutlineSearch,
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineUserAdd,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiPlus,
} from 'react-icons/hi';
import {
  HiCalendar,
  HiChevronUpDown,
  HiMagnifyingGlassPlus,
  HiOutlineArrowUpCircle,
  HiOutlineCalendarDays,
  HiOutlineLanguage,
  HiOutlineUsers as HiOutlineUsers2,
} from 'react-icons/hi2';
import { LuBookOpenCheck, LuCopy } from 'react-icons/lu';
import { RxMagicWand } from 'react-icons/rx';
import { TfiTimer } from 'react-icons/tfi';
import { AccessibleIcon } from './AccessibleIcon';
import { IconProps } from './variants';

import {
  IoChevronBack,
  IoLocationOutline,
  IoWarning,
  IoWarningOutline,
} from 'react-icons/io5';

import {
  FiAward,
  FiEdit,
  FiLifeBuoy,
  FiLogIn,
  FiLogOut,
  FiMessageSquare,
  FiMoreHorizontal,
  FiSend,
  FiSettings,
  FiSmile,
} from 'react-icons/fi';
import {
  MdOutlineClose,
  MdOutlineError,
  MdOutlineNotificationsActive,
  MdOutlineNotificationsNone,
} from 'react-icons/md';
import {
  RiDiscordLine,
  RiFacebookCircleLine,
  RiInstagramLine,
  RiMoonFill,
  RiStarFill,
  RiStarLine,
  RiSunLine,
  RiTelegramLine,
  RiTiktokLine,
  RiTwitchLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from 'react-icons/ri';

import { TbSunMoon } from 'react-icons/tb';

import { PiIdentificationCardLight, PiSealQuestionBold } from 'react-icons/pi';

// import and export IconType

import type { IconType as ReactIcon } from 'react-icons';

export type IconType = ReactIcon;

export const Copy: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={LuCopy} label={'Copy'} {...props} />
);

export const InfoAvailable: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={LuBookOpenCheck}
    label={'Info Available'}
    {...props}
  />
);

export const UserIdentification: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={PiIdentificationCardLight}
    label={'User identification'}
    {...props}
  />
);

export const InfoSealed: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={PiSealQuestionBold}
    label={'Info Sealed'}
    {...props}
  />
);

export const Timer: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={TfiTimer} label={'Timer'} {...props} />
);

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

export const CurrencySettings: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={BsCurrencyExchange}
    label={'CurrencySettings'}
    {...props}
  />
);

export const Download: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={BsDownload} label={'Download'} {...props} />
);

export const EventManagement: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={BsCalendarWeek}
    label={'Event Management'}
    {...props}
  />
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

export const Star: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiStarLine} label={'Star'} {...props} />
);

export const StarFill: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiStarFill} label={'Star Fill'} {...props} />
);

export const Telegram: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={RiTelegramLine}
    label={'Telegram'}
    {...props}
  />
);

export const Discord: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiDiscordLine} label={'Discord'} {...props} />
);

export const Youtube: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiYoutubeLine} label={'Youtube'} {...props} />
);

export const TikTok: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiTiktokLine} label={'TikTok'} {...props} />
);

export const Twitch: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiTwitchLine} label={'Twitch'} {...props} />
);

export const Sun: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiSunLine} label={'Sun'} {...props} />
);

export const Twitter: FC<IconProps> = (props) => (
  <AccessibleIcon IconComponent={RiTwitterXLine} label={'Twitter'} {...props} />
);

export const Facebook: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={RiFacebookCircleLine}
    label={'Facebook'}
    {...props}
  />
);

export const Instagram: FC<IconProps> = (props) => (
  <AccessibleIcon
    IconComponent={RiInstagramLine}
    label={'Instagram'}
    {...props}
  />
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
  <AccessibleIcon IconComponent={HiOutlineUsers2} label={'Users'} {...props} />
);

export const UserRoles: FC<IconProps> = (props) => (
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
