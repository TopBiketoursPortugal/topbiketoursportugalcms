import {
  Envelope,
  User,
  Coffee,
  Egg,
  ForkKnife,
  Carrot,
  Hamburger,
  FishSimple,
  Plant,
  BowlFood,
  Pizza,
  Pepper,
  Champagne,
  Check,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  CaretLeft,
  CaretRight,
  CaretDown,
  CaretUp,
  PaperPlane,
  ShoppingCart,
  Storefront,
  ShoppingBag,
  CreditCard,
  House,
  MagnifyingGlass,
  Image,
  Phone,
  List,
  Heart,
  X,
  Chat,
  Truck,
  Smiley,
  Bell,
  Calendar,
  Info,
  Fire,
  Hand,
  BookmarkSimple,
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
  GoogleLogo,
  StripeLogo,
  GithubLogo,
  Quotes,
  Star,
  StarHalf,
  Tag,
  UsersThree,
  Users,
  Airplane,
  PersonSimpleBike,
  MapTrifold,
  XCircle,
  MapPin,
  Circle,
  Crosshair,
  Gift,
  Bread,
  AppleLogo
} from '@phosphor-icons/react';

import { Icon as IconReact } from '@iconify/react';

export default function Icon({
  icon,
  class: className,
  title
}: {
  icon: string;
  class?: string;
  title?: string;
}) {
  switch (icon) {
    case 'ph:check-circle-fill':
      return <CheckCircle weight="fill" className={className} alt={title} />;
    case 'ph:x-circle-fill':
      return <XCircle weight="fill" className={className} alt={title} />;
    case 'ph:map-trifold-light':
      return <MapTrifold weight="light" className={className} alt={title} />;
    case 'ph:person-simple-bike-light':
      return (
        <PersonSimpleBike weight="light" className={className} alt={title} />
      );
    case 'ph:airplane-light':
      return <Airplane weight="light" className={className} alt={title} />;
    case 'ph:user-light':
      return <Users weight="light" className={className} alt={title} />;
    case 'ph:users-three-light':
      return <UsersThree weight="light" className={className} alt={title} />;
    case 'ph:clock':
      return <Info weight="light" className={className} alt={title} />;
    case 'ph:info-light':
      return <Info weight="light" className={className} alt={title} />;
    case 'ph:tag-light':
      return <Tag weight="light" className={className} alt={title} />;
    case 'ph:bookmark-simple-thin':
      return (
        <BookmarkSimple weight="light" className={className} alt={title} />
      );
    case 'ph:quotes-fill':
      return <Quotes weight="fill" className={className} alt={title} />;
    case 'ph:star-fill':
      return <Star weight="fill" className={className} alt={title} />;
    case 'ph:star-half-fill':
      return <StarHalf weight="fill" className={className} alt={title} />;
    case 'ph:star-light':
      return <Star weight="light" className={className} alt={title} />;
    case 'Envelope':
      return <Envelope className={className} alt={title} />;
    case 'User':
      return <User className={className} alt={title} />;
    case 'Bread':
      return <Bread className={className} alt={title} />;
    case 'Mug':
      return <Coffee className={className} alt={title} />;
    case 'Egg':
      return <Egg className={className} alt={title} />;
    case 'Utensils':
      return <ForkKnife className={className} alt={title} />;
    case 'Carrot':
      return <Carrot className={className} alt={title} />;
    case 'Burger':
      return <Hamburger className={className} alt={title} />;
    case 'Fish':
      return <FishSimple className={className} alt={title} />;
    case 'Seedling':
      return <Plant className={className} alt={title} />;
    case 'PlateWheat':
      return <BowlFood className={className} alt={title} />;
    case 'PizzaSlice':
      return <Pizza className={className} alt={title} />;
    case 'PepperHot':
      return <Pepper className={className} alt={title} />;
    case 'ChampagneGlasses':
      return <Champagne className={className} alt={title} />;
    case 'AppleWhole':
      return <AppleLogo className={className} alt={title} />;
    case 'BowlRice':
      return <BowlFood className={className} alt={title} />;
    case 'Check':
      return <Check className={className} alt={title} />;
    case 'CircleCheck':
      return <CheckCircle className={className} alt={title} />;
    case 'ArrowRight':
      return <ArrowRight className={className} alt={title} />;
    case 'ArrowLeft':
      return <ArrowLeft className={className} alt={title} />;
    case 'ArrowDown':
      return <ArrowDown className={className} alt={title} />;
    case 'ArrowUp':
      return <ArrowUp className={className} alt={title} />;
    case 'CaretLeft':
      return <CaretLeft className={className} alt={title} />;
    case 'CaretRight':
      return <CaretRight className={className} alt={title} />;
    case 'CaretDown':
      return <CaretDown className={className} alt={title} />;
    case 'CaretUp':
      return <CaretUp className={className} alt={title} />;
    case 'PaperPlane':
      return <PaperPlane className={className} alt={title} />;
    case 'CartShopping':
      return <ShoppingCart className={className} alt={title} />;
    case 'Shop':
      return <Storefront className={className} alt={title} />;
    case 'BagShopping':
      return <ShoppingBag className={className} alt={title} />;
    case 'CreditCard':
      return <CreditCard className={className} alt={title} />;
    case 'Store':
      return <Storefront className={className} alt={title} />;
    case 'ShopLock':
      return (
        <IconReact
          icon="fa6-solid:shop-lock"
          className={className}
          xlinkTitle={title}
        />
      ); // No exact locked shop equivalent
    case 'Car':
      return <Truck className={className} alt={title} />; // Using Truck as closest match
    case 'CircleHalfStroke':
      return <Circle className={className} alt={title} />; // Using basic Circle
    case 'LocationDot':
      return <MapPin className={className} alt={title} />;
    case 'LocationPin':
      return <MapPin className={className} alt={title} />;
    case 'LocationCrosshairs':
      return <Crosshair className={className} alt={title} />;
    case 'Gift':
      return <Gift className={className} alt={title} />;
    case 'House':
      return <House className={className} alt={title} />;
    case 'MagnifyingGlass':
      return <MagnifyingGlass className={className} alt={title} />;
    case 'Image':
      return <Image className={className} alt={title} />;
    case 'Phone':
      return <Phone className={className} alt={title} />;
    case 'Bars':
      return <List className={className} alt={title} />;
    case 'Heart':
      return <Heart className={className} alt={title} />;
    case 'Xmark':
      return <X className={className} alt={title} />;
    case 'Comment':
      return <Chat className={className} alt={title} />;
    case 'TruckFast':
      return <Truck className={className} alt={title} />;
    case 'FaceSmile':
      return <Smiley className={className} alt={title} />;
    case 'Bell':
      return <Bell className={className} alt={title} />;
    case 'CalendarDays':
      return <Calendar className={className} alt={title} />;
    case 'CircleInfo':
      return <Info className={className} alt={title} />;
    case 'Fire':
      return <Fire className={className} alt={title} />;
    case 'Hand':
      return <Hand className={className} alt={title} />;
    case 'Lemon':
      return <IconReact icon="circum:lemon" width="1.76em" height="2em" />;
    case 'Bookmark':
      return <BookmarkSimple className={className} alt={title} />;
    case 'Facebook':
      return <FacebookLogo className={className} alt={title} />;
    case 'Instagram':
      return <InstagramLogo className={className} alt={title} />;
    case 'Youtube':
      return <YoutubeLogo className={className} alt={title} />;
    case 'Google':
      return <GoogleLogo className={className} alt={title} />;
    case 'Stripe':
      return <StripeLogo className={className} alt={title} />;
    case 'Shopify':
      return <IconReact icon="logos:shopify" width="1.76em" height="2em" />;
    case 'Github':
      return <GithubLogo className={className} alt={title} />;
    case 'CloudCannon':
      return (
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 87.000000 59.000000"
        >
          <g
            transform="translate(0.000000,59.000000) scale(0.100000,-0.100000)"
            fill="currentColor"
            stroke="none"
          >
            <path
              d="M183 575 c-34 -14 -63 -59 -63 -97 0 -16 -12 -30 -39 -45 -107 -61
                  -101 -221 10 -279 22 -11 29 -21 29 -45 0 -22 10 -41 34 -65 28 -28 41 -34 78
                  -34 24 0 53 6 63 14 16 12 23 12 39 0 25 -17 56 -1 56 29 -1 16 -15 30 -53 52
                  -74 43 -112 108 -112 189 0 84 32 139 108 189 42 29 57 44 57 62 0 28 -34 43
                  -55 25 -12 -10 -22 -9 -49 4 -41 19 -61 20 -103 1z"
            />
            <path
              d="M582 575 c-25 -11 -38 -12 -57 -3 -19 8 -28 8 -40 -2 -25 -21 -18
                  -49 18 -68 51 -27 111 -94 125 -139 34 -115 -10 -212 -127 -275 -34 -19 -41
                  -48 -16 -68 12 -10 21 -10 40 -2 19 9 31 8 52 -3 35 -19 55 -19 98 -1 36 15
                  65 59 65 98 0 16 11 29 37 43 47 25 83 86 83 140 0 54 -36 115 -83 140 -26 14
                  -37 27 -37 43 0 39 -29 83 -65 98 -42 17 -51 17 -93 -1z"
            />
            <path d="M368 404 c-80 -43 -76 -179 6 -218 73 -35 149 -4 175 71 13 35 13 46 0 79 -27 72 -114 105 -181 68z" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}
