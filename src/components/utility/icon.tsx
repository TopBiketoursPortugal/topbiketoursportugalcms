import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import CloudCannon from '../../assets/icons/cloudcannon.svg';
// import JCBIcon from '../../assets/icons/jcb.svg';
// import PhStartFill from 'src/assets/icons/logo.svg/fill/star-fill.svg';
import {
  faEnvelope,
  faUser,
  faBreadSlice,
  faMugSaucer,
  faEgg,
  faUtensils,
  faCarrot,
  faBurger,
  faFish,
  faSeedling,
  faWheatAwn,
  faPlateWheat,
  faPizzaSlice,
  faPepperHot,
  faChampagneGlasses,
  faAppleWhole,
  faBowlRice,
  faCheck,
  faCircleCheck,
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faArrowUp,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faCaretUp,
  faPaperPlane,
  faCartShopping,
  faShop,
  faBagShopping,
  faCreditCard,
  faStore,
  faShopLock,
  faCar,
  faCircleHalfStroke,
  faLanguage,
  faLocationDot,
  faLocationPin,
  faLocationCrosshairs,
  faGift,
  faHouse,
  faMagnifyingGlass,
  faImage,
  faPhone,
  faBars,
  faHeart,
  faXmark,
  faComment,
  faTruckFast,
  faFaceSmile,
  faBell,
  faCalendarDays,
  faCircleInfo,
  faFire,
  faHand,
  faStar,
  faStarHalf,
  faRss,
  faCompass,
  faMoon,
  faCircleXmark,
  faTag,
  faUsers,
  faBiking,
  faPlaneArrival
} from '@fortawesome/free-solid-svg-icons';

import {
  faClock,
  faMap,
  faStar as faStarOutline,
  faSun
} from '@fortawesome/free-regular-svg-icons';

import { faLemon, faBookmark } from '@fortawesome/free-regular-svg-icons';
import {
  faFacebook,
  faInstagram,
  faYoutube,
  faGoogle,
  faStripe,
  faShopify,
  faGithub,
  faXTwitter,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';
import type { IconNames } from 'src/types';
import { cn } from 'utils/cn';

export default function Icon({
  icon,
  className,
  title
}: {
  icon: IconNames;
  className?: string;
  title?: string;
}) {
  const style = cn('h-6 w-6 ' + className);
  switch (icon) {
    case 'logos:mastercard':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2.58em"
          height="2em"
          viewBox="0 0 256 199"
          className={style}
        >
          <path d="M46.54 198.011V184.84c0-5.05-3.074-8.342-8.343-8.342c-2.634 0-5.488.878-7.464 3.732c-1.536-2.415-3.731-3.732-7.024-3.732c-2.196 0-4.39.658-6.147 3.073v-2.634h-4.61v21.074h4.61v-11.635c0-3.731 1.976-5.488 5.05-5.488c3.072 0 4.61 1.976 4.61 5.488v11.635h4.61v-11.635c0-3.731 2.194-5.488 5.048-5.488c3.074 0 4.61 1.976 4.61 5.488v11.635zm68.271-21.074h-7.463v-6.366h-4.61v6.366h-4.171v4.17h4.17v9.66c0 4.83 1.976 7.683 7.245 7.683c1.976 0 4.17-.658 5.708-1.536l-1.318-3.952c-1.317.878-2.853 1.098-3.951 1.098c-2.195 0-3.073-1.317-3.073-3.513v-9.44h7.463zm39.076-.44c-2.634 0-4.39 1.318-5.488 3.074v-2.634h-4.61v21.074h4.61v-11.854c0-3.512 1.536-5.488 4.39-5.488c.878 0 1.976.22 2.854.439l1.317-4.39c-.878-.22-2.195-.22-3.073-.22m-59.052 2.196c-2.196-1.537-5.269-2.195-8.562-2.195c-5.268 0-8.78 2.634-8.78 6.805c0 3.513 2.634 5.488 7.244 6.147l2.195.22c2.415.438 3.732 1.097 3.732 2.195c0 1.536-1.756 2.634-4.83 2.634s-5.488-1.098-7.025-2.195l-2.195 3.512c2.415 1.756 5.708 2.634 9 2.634c6.147 0 9.66-2.853 9.66-6.805c0-3.732-2.854-5.708-7.245-6.366l-2.195-.22c-1.976-.22-3.512-.658-3.512-1.975c0-1.537 1.536-2.415 3.951-2.415c2.635 0 5.269 1.097 6.586 1.756zm122.495-2.195c-2.635 0-4.391 1.317-5.489 3.073v-2.634h-4.61v21.074h4.61v-11.854c0-3.512 1.537-5.488 4.39-5.488c.879 0 1.977.22 2.855.439l1.317-4.39c-.878-.22-2.195-.22-3.073-.22m-58.833 10.976c0 6.366 4.39 10.976 11.196 10.976c3.073 0 5.268-.658 7.463-2.414l-2.195-3.732c-1.756 1.317-3.512 1.975-5.488 1.975c-3.732 0-6.366-2.634-6.366-6.805c0-3.951 2.634-6.586 6.366-6.805c1.976 0 3.732.658 5.488 1.976l2.195-3.732c-2.195-1.757-4.39-2.415-7.463-2.415c-6.806 0-11.196 4.61-11.196 10.976m42.588 0v-10.537h-4.61v2.634c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976s4.61 10.976 10.537 10.976c3.073 0 5.269-1.097 6.586-3.073v2.634h4.61zm-16.904 0c0-3.732 2.415-6.805 6.366-6.805c3.732 0 6.367 2.854 6.367 6.805c0 3.732-2.635 6.805-6.367 6.805c-3.951-.22-6.366-3.073-6.366-6.805m-55.1-10.976c-6.147 0-10.538 4.39-10.538 10.976s4.39 10.976 10.757 10.976c3.073 0 6.147-.878 8.562-2.853l-2.196-3.293c-1.756 1.317-3.951 2.195-6.146 2.195c-2.854 0-5.708-1.317-6.367-5.05h15.587v-1.755c.22-6.806-3.732-11.196-9.66-11.196m0 3.951c2.853 0 4.83 1.757 5.268 5.05h-10.976c.439-2.854 2.415-5.05 5.708-5.05m114.372 7.025v-18.879h-4.61v10.976c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976s4.61 10.976 10.537 10.976c3.074 0 5.269-1.097 6.586-3.073v2.634h4.61zm-16.903 0c0-3.732 2.414-6.805 6.366-6.805c3.732 0 6.366 2.854 6.366 6.805c0 3.732-2.634 6.805-6.366 6.805c-3.952-.22-6.366-3.073-6.366-6.805m-154.107 0v-10.537h-4.61v2.634c-1.537-1.975-3.732-3.073-6.586-3.073c-5.927 0-10.537 4.61-10.537 10.976s4.61 10.976 10.537 10.976c3.074 0 5.269-1.097 6.586-3.073v2.634h4.61zm-17.123 0c0-3.732 2.415-6.805 6.366-6.805c3.732 0 6.367 2.854 6.367 6.805c0 3.732-2.635 6.805-6.367 6.805c-3.951-.22-6.366-3.073-6.366-6.805" />
          <path fill="#ff5f00" d="M93.298 16.903h69.15v124.251h-69.15z" />
          <path
            fill="#eb001b"
            d="M97.689 79.029c0-25.245 11.854-47.637 30.074-62.126C114.373 6.366 97.47 0 79.03 0C35.343 0 0 35.343 0 79.029s35.343 79.029 79.029 79.029c18.44 0 35.343-6.366 48.734-16.904c-18.22-14.269-30.074-36.88-30.074-62.125"
          />
          <path
            fill="#f79e1b"
            d="M255.746 79.029c0 43.685-35.343 79.029-79.029 79.029c-18.44 0-35.343-6.366-48.734-16.904c18.44-14.488 30.075-36.88 30.075-62.125s-11.855-47.637-30.075-62.126C141.373 6.366 158.277 0 176.717 0c43.686 0 79.03 35.563 79.03 79.029"
          />
        </svg>
      );
    case 'logos:visa':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="6.17em"
          height="2em"
          viewBox="0 0 256 83"
          className={style}
        >
          <title>{title}</title>
          <defs>
            <linearGradient
              id="logosVisa0"
              x1="45.974%"
              x2="54.877%"
              y1="-2.006%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#222357" />
              <stop offset="100%" stopColor="#254aa5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#logosVisa0)"
            d="M132.397 56.24c-.146-11.516 10.263-17.942 18.104-21.763c8.056-3.92 10.762-6.434 10.73-9.94c-.06-5.365-6.426-7.733-12.383-7.825c-10.393-.161-16.436 2.806-21.24 5.05l-3.744-17.519c4.82-2.221 13.745-4.158 23-4.243c21.725 0 35.938 10.724 36.015 27.351c.085 21.102-29.188 22.27-28.988 31.702c.069 2.86 2.798 5.912 8.778 6.688c2.96.392 11.131.692 20.395-3.574l3.636 16.95c-4.982 1.814-11.385 3.551-19.357 3.551c-20.448 0-34.83-10.87-34.946-26.428m89.241 24.968c-3.967 0-7.31-2.314-8.802-5.865L181.803 1.245h21.709l4.32 11.939h26.528l2.506-11.939H256l-16.697 79.963zm3.037-21.601l6.265-30.027h-17.158zm-118.599 21.6L88.964 1.246h20.687l17.104 79.963zm-30.603 0L53.941 26.782l-8.71 46.277c-1.022 5.166-5.058 8.149-9.54 8.149H.493L0 78.886c7.226-1.568 15.436-4.097 20.41-6.803c3.044-1.653 3.912-3.098 4.912-7.026L41.819 1.245H63.68l33.516 79.963z"
            transform="matrix(1 0 0 -1 0 82.668)"
          />
        </svg>
      );
    case 'logos:amex':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2em"
          height="2em"
          viewBox="0 0 256 256"
          className={style}
        >
          <title>{title}</title>
          <path
            fill="#006fcf"
            d="M256 138.548V0H0v256h256v-74.69c-.57 0 0-42.762 0-42.762"
          />
          <path
            fill="#fff"
            d="M224.641 124.294h19.386V79.252H222.93v6.271l-3.991-6.271h-18.245v7.982l-3.421-7.982h-33.64c-1.14 0-2.28.57-3.42.57s-1.71.57-2.851 1.14c-1.14.57-1.71.57-2.85 1.14v-2.85H58.155l-2.85 7.412l-2.852-7.412H29.648v7.982l-3.42-7.982H7.981L0 98.637v25.657h13.114l2.28-6.272h4.561l2.281 6.272h100.348v-5.702l3.99 5.702h27.938v-3.42c.57.57 1.71.57 2.28 1.14c.571.57 1.711.57 2.281 1.14c1.14.57 2.281.57 3.421.57h20.526l2.28-6.272h4.562l2.28 6.272h27.938v-5.702zM256 181.31v-42.192H99.207l-3.991 5.702l-3.991-5.702H45.612v45.042h45.613l3.991-5.701l3.991 5.701h28.508v-9.692h-1.14q5.986 0 10.262-1.71v11.973h20.526v-5.702l3.991 5.702h84.953c3.421-1.14 6.842-1.711 9.693-3.421"
          />
          <path
            fill="#006fcf"
            d="M246.307 170.477h-15.394v6.271h14.824c6.272 0 10.263-3.99 10.263-9.692s-3.42-8.553-9.122-8.553h-6.842c-1.71 0-2.851-1.14-2.851-2.85s1.14-2.851 2.85-2.851h13.114L256 146.53h-15.394c-6.272 0-10.263 3.991-10.263 9.123c0 5.701 3.42 8.552 9.122 8.552h6.842c1.71 0 2.851 1.14 2.851 2.85c.57 2.281-.57 3.422-2.85 3.422m-27.937 0h-15.394v6.271H217.8c6.271 0 10.262-3.99 10.262-9.692s-3.42-8.553-9.122-8.553h-6.842c-1.71 0-2.85-1.14-2.85-2.85s1.14-2.851 2.85-2.851h13.114l2.85-6.272h-15.394c-6.272 0-10.263 3.991-10.263 9.123c0 5.701 3.421 8.552 9.123 8.552h6.842c1.71 0 2.85 1.14 2.85 2.85c.57 2.281-1.14 3.422-2.85 3.422m-19.956-18.245v-6.272h-23.946v30.218h23.946v-6.272H181.31v-6.271h16.534v-6.272H181.31v-5.702h17.104zm-38.77 0c2.85 0 3.99 1.71 3.99 3.42c0 1.711-1.14 3.421-3.99 3.421h-8.553v-7.412zm-8.553 13.113h3.421l9.123 10.833h8.552l-10.263-11.403c5.132-1.14 7.982-4.561 7.982-9.122c0-5.702-3.99-9.693-10.262-9.693h-15.965v30.218h6.842zm-18.245-9.122c0 2.28-1.14 3.99-3.99 3.99h-9.123v-7.981h8.552c2.85 0 4.561 1.71 4.561 3.99m-19.955-10.263v30.218h6.842v-10.263h9.122c6.272 0 10.833-3.99 10.833-10.262c0-5.702-3.99-10.263-10.263-10.263zm-10.263 30.218h8.552l-11.973-15.394l11.973-14.824h-8.552l-7.412 9.693l-7.412-9.693h-8.552l11.973 14.824l-11.973 14.824h8.552l7.412-9.693zm-25.657-23.946v-6.272H53.024v30.218h23.947v-6.272H59.866v-6.271h16.535v-6.272H59.866v-5.702h17.105zm138.548-53.595l11.973 18.245h8.553V86.664h-6.842v19.955l-1.71-2.85l-10.834-17.105h-9.122v30.218h6.842V96.356zm-29.648-.57l2.28-6.272l2.281 6.272l2.85 6.842H183.02zm11.973 18.815h7.412l-13.113-30.218h-9.123l-13.114 30.218h7.412l2.851-6.272h14.824zm-31.929 0l2.851-6.272h-1.71c-5.132 0-7.983-3.42-7.983-8.552v-.57c0-5.132 2.851-8.553 7.983-8.553h7.412v-6.271h-7.982c-9.123 0-14.254 6.271-14.254 14.824v.57c0 9.122 5.131 14.824 13.683 14.824m-25.657 0h6.842V87.234h-6.842zm-14.824-23.947c2.851 0 3.991 1.71 3.991 3.421s-1.14 3.421-3.99 3.421h-8.553v-7.412zm-8.552 13.114h3.42l9.123 10.833h8.553l-10.263-11.403c5.131-1.14 7.982-4.561 7.982-9.123c0-5.701-3.991-9.692-10.263-9.692H109.47v30.218h6.842zm-12.543-13.114v-6.271H80.392v30.218h23.947v-6.272H87.234v-6.271h16.534v-6.272H87.234v-5.702h17.105zm-51.885 23.947h6.272l8.552-24.517v24.517h6.842V86.664H62.717l-6.842 20.525l-6.842-20.525H37.63v30.218h6.842V92.365zm-37.06-18.815l2.28-6.272l2.281 6.272l2.851 6.842H12.543zm11.973 18.815h7.413L21.666 86.664h-8.552L0 116.882h7.412l2.85-6.272h14.825z"
          />
        </svg>
      );
    // case 'logos:jcb':
    //   return <JCBIcon />;
    case 'ph:compass-fill':
      return (
        <FontAwesomeIcon icon={faCompass} className={style} title={title} />
      );
    case 'ph:rss-light':
      return <FontAwesomeIcon icon={faRss} className={style} title={title} />;
    case 'ph:sun-light':
      return <FontAwesomeIcon icon={faSun} className={style} title={title} />;
    case 'ph:moon-light':
      return <FontAwesomeIcon icon={faMoon} className={style} title={title} />;
    case 'ph:star-fill':
      // return <PhStartFill />;
      return <FontAwesomeIcon icon={faStar} className={style} title={title} />;
    case 'ph:star-light':
      return (
        <FontAwesomeIcon icon={faStarOutline} className={style} title={title} />
      );
    case 'ph:star-half-fill':
      return (
        <FontAwesomeIcon icon={faStarHalf} className={style} title={title} />
      );
    case 'Language':
      return (
        <FontAwesomeIcon icon={faLanguage} className={style} title={title} />
      );
    case 'Envelope':
    case 'ph:envelope-simple-thin':
      return (
        <FontAwesomeIcon icon={faEnvelope} className={style} title={title} />
      );
    case 'User':
    case 'ph:user-light':
      return <FontAwesomeIcon icon={faUser} className={style} title={title} />;
    case 'Bread':
      return (
        <FontAwesomeIcon icon={faBreadSlice} className={style} title={title} />
      );
    case 'Mug':
      return (
        <FontAwesomeIcon icon={faMugSaucer} className={style} title={title} />
      );
    case 'Egg':
      return <FontAwesomeIcon icon={faEgg} className={style} title={title} />;
    case 'Utensils':
      return (
        <FontAwesomeIcon icon={faUtensils} className={style} title={title} />
      );
    case 'Carrot':
      return (
        <FontAwesomeIcon icon={faCarrot} className={style} title={title} />
      );
    case 'Burger':
      return (
        <FontAwesomeIcon icon={faBurger} className={style} title={title} />
      );
    case 'Fish':
      return <FontAwesomeIcon icon={faFish} className={style} title={title} />;
    case 'Seedling':
      return (
        <FontAwesomeIcon icon={faSeedling} className={style} title={title} />
      );
    case 'WheatAwn':
      return (
        <FontAwesomeIcon icon={faWheatAwn} className={style} title={title} />
      );
    case 'PlateWheat':
      return (
        <FontAwesomeIcon icon={faPlateWheat} className={style} title={title} />
      );
    case 'PizzaSlice':
      return (
        <FontAwesomeIcon icon={faPizzaSlice} className={style} title={title} />
      );
    case 'PepperHot':
      return (
        <FontAwesomeIcon icon={faPepperHot} className={style} title={title} />
      );
    case 'ChampagneGlasses':
      return (
        <FontAwesomeIcon
          icon={faChampagneGlasses}
          className={style}
          title={title}
        />
      );
    case 'AppleWhole':
      return (
        <FontAwesomeIcon icon={faAppleWhole} className={style} title={title} />
      );
    case 'BowlRice':
      return (
        <FontAwesomeIcon icon={faBowlRice} className={style} title={title} />
      );
    case 'Check':
      return <FontAwesomeIcon icon={faCheck} className={style} title={title} />;
    case 'CircleCheck':
    case 'ph:check-circle-fill':
      return (
        <FontAwesomeIcon icon={faCircleCheck} className={style} title={title} />
      );
    case 'ph:x-circle-fill':
      return (
        <FontAwesomeIcon icon={faCircleXmark} className={style} title={title} />
      );
    case 'ArrowRight':
      return (
        <FontAwesomeIcon icon={faArrowRight} className={style} title={title} />
      );
    case 'ArrowLeft':
      return (
        <FontAwesomeIcon icon={faArrowLeft} className={style} title={title} />
      );
    case 'ArrowDown':
      return (
        <FontAwesomeIcon icon={faArrowDown} className={style} title={title} />
      );
    case 'ArrowUp':
      return (
        <FontAwesomeIcon icon={faArrowUp} className={style} title={title} />
      );
    case 'CaretLeft':
      return (
        <FontAwesomeIcon icon={faCaretLeft} className={style} title={title} />
      );
    case 'CaretRight':
      return (
        <FontAwesomeIcon icon={faCaretRight} className={style} title={title} />
      );
    case 'CaretDown':
      return (
        <FontAwesomeIcon icon={faCaretDown} className={style} title={title} />
      );
    case 'CaretUp':
      return (
        <FontAwesomeIcon icon={faCaretUp} className={style} title={title} />
      );
    case 'PaperPlane':
      return (
        <FontAwesomeIcon icon={faPaperPlane} className={style} title={title} />
      );
    case 'CartShopping':
      return (
        <FontAwesomeIcon
          icon={faCartShopping}
          className={style}
          title={title}
        />
      );
    case 'Shop':
      return <FontAwesomeIcon icon={faShop} className={style} title={title} />;
    case 'BagShopping':
      return (
        <FontAwesomeIcon icon={faBagShopping} className={style} title={title} />
      );
    case 'CreditCard':
      return (
        <FontAwesomeIcon icon={faCreditCard} className={style} title={title} />
      );
    case 'Store':
      return <FontAwesomeIcon icon={faStore} className={style} title={title} />;
    case 'ShopLock':
      return (
        <FontAwesomeIcon icon={faShopLock} className={style} title={title} />
      );
    case 'Car':
      return <FontAwesomeIcon icon={faCar} className={style} title={title} />;
    case 'CircleHalfStroke':
      return (
        <FontAwesomeIcon
          icon={faCircleHalfStroke}
          className={style}
          title={title}
        />
      );
    case 'LocationDot':
      return (
        <FontAwesomeIcon icon={faLocationDot} className={style} title={title} />
      );
    case 'LocationPin':
      return (
        <FontAwesomeIcon icon={faLocationPin} className={style} title={title} />
      );
    case 'LocationCrosshairs':
      return (
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className={style}
          title={title}
        />
      );
    case 'Gift':
      return <FontAwesomeIcon icon={faGift} className={style} title={title} />;
    case 'House':
      return <FontAwesomeIcon icon={faHouse} className={style} title={title} />;
    case 'MagnifyingGlass':
      return (
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={style}
          title={title}
        />
      );
    case 'Image':
      return <FontAwesomeIcon icon={faImage} className={style} title={title} />;
    case 'Phone':
    case 'ph:phone-thin':
      return <FontAwesomeIcon icon={faPhone} className={style} title={title} />;
    case 'Bars':
      return <FontAwesomeIcon icon={faBars} className={style} title={title} />;
    case 'Heart':
      return <FontAwesomeIcon icon={faHeart} className={style} title={title} />;
    case 'Xmark':
      return <FontAwesomeIcon icon={faXmark} className={style} title={title} />;

    case 'Comment':
      return (
        <FontAwesomeIcon icon={faComment} className={style} title={title} />
      );
    case 'TruckFast':
      return (
        <FontAwesomeIcon icon={faTruckFast} className={style} title={title} />
      );
    case 'FaceSmile':
      return (
        <FontAwesomeIcon icon={faFaceSmile} className={style} title={title} />
      );
    case 'Bell':
      return <FontAwesomeIcon icon={faBell} className={style} title={title} />;
    case 'CalendarDays':
      return (
        <FontAwesomeIcon
          icon={faCalendarDays}
          className={style}
          title={title}
        />
      );
    case 'ph:info':
    case 'CircleInfo':
      return (
        <FontAwesomeIcon icon={faCircleInfo} className={style} title={title} />
      );
    case 'Fire':
      return <FontAwesomeIcon icon={faFire} className={style} title={title} />;
    case 'Hand':
      return <FontAwesomeIcon icon={faHand} className={style} title={title} />;
    case 'Lemon':
      return <FontAwesomeIcon icon={faLemon} className={style} title={title} />;
    case 'ph:tag-light':
      return <FontAwesomeIcon icon={faTag} className={style} title={title} />;
    case 'Bookmark':
    case 'ph:bookmark-simple-thin':
      return (
        <FontAwesomeIcon icon={faBookmark} className={style} title={title} />
      );
    case 'Facebook':
    case 'ph:facebook-logo-light':
      return (
        <FontAwesomeIcon icon={faFacebook} className={style} title={title} />
      );
    case 'Instagram':
    case 'ph:instagram-logo-light':
      return (
        <FontAwesomeIcon icon={faInstagram} className={style} title={title} />
      );
    case 'Youtube':
    case 'ph:youtube-logo-light':
      return (
        <FontAwesomeIcon icon={faYoutube} className={style} title={title} />
      );
    case 'Google':
      return (
        <FontAwesomeIcon icon={faGoogle} className={style} title={title} />
      );
    case 'ph:whatsapp-logo-light':
      return (
        <FontAwesomeIcon icon={faWhatsapp} className={style} title={title} />
      );
    case 'ph:x-logo-light':
      return (
        <FontAwesomeIcon icon={faXTwitter} className={style} title={title} />
      );
    case 'Tripadvisor':
    case 'fa:tripadvisor':
      return (
        <svg
          xlinkTitle={title}
          className={style}
          viewBox="0 0 1316 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>{title}</title>
          <path d="M372 569.714286q0 22.285714-15.714286 38T318.857143 623.428571q-22.285714 0-38-15.714285T265.142857 569.714286q0-21.714286 15.714286-37.428572T318.857143 516.571429q21.714286 0 37.428571 15.714285T372 569.714286z m659.428571-0.571429q0 22.285714-15.714285 38T977.714286 622.857143t-38-15.714286T924 569.142857t15.714286-37.714286 38-15.428571 38 15.428571 15.714285 37.714286z m-594.285714 0.571429q0-45.142857-32.285714-77.714286T326.857143 459.428571t-78 32.285715T216.571429 569.714286t32.285714 78T326.857143 680t78-32.285714T437.142857 569.714286z m658.857143-0.571429q0-45.714286-32.285714-78T985.714286 458.857143q-45.142857 0-77.714286 32.285714T875.428571 569.142857t32.285715 78T985.714286 679.428571t78-32.285714T1096 569.142857z m-610.285714 0.571429q0 66.285714-46.571429 112.857143T326.857143 729.142857q-66.285714 0-112.857143-46.857143T167.428571 569.714286t46.857143-112.285715T326.857143 410.857143t112.285714 46.571428T485.714286 569.714286z m659.428571-0.571429q0 65.714286-46.571428 112.285714T985.714286 728q-65.714286 0-112.285715-46.571429T826.857143 569.142857t46.571428-112.285714T985.714286 410.285714q66.285714 0 112.857143 46.571429T1145.142857 569.142857z m-550.857143 1.714286q0-109.142857-77.428571-186.571429T330.285714 306.857143q-71.428571 0-132 35.428571T102.285714 438.571429 66.857143 570.857143t35.428571 132.285714T198.285714 799.428571t132 35.428572q109.142857 0 186.571429-77.428572T594.285714 570.857143z m381.714286-327.428572q-145.142857-63.428571-317.714286-63.428571-182.285714 0-327.428571 62.857143 66.857143 0 127.428571 26T562.571429 338.857143t69.714285 104.571428T658.285714 570.857143q0-65.714286 24.857143-125.428572t67.428572-103.142857T852 272t124-28.571429z m273.714286 327.428572q0-109.142857-77.142857-186.571429T986.285714 306.857143t-186.571428 77.428571T722.285714 570.857143t77.428572 186.571428T986.285714 834.857143t186.285715-77.428572T1249.714286 570.857143z m-152-323.428572h218.857143q-25.142857 29.142857-42.857143 65.428572T1250.857143 378.285714q62.857143 86.285714 62.857143 192.571429 0 89.142857-44 164.571428t-119.428572 119.142858-164 43.714285q-76 0-142.285714-32t-112-88.571428q-26.857143 32-73.714286 102.285714-6.285714-12.571429-30.571428-47.142857T585.142857 777.142857q-45.714286 56.571429-112.285714 88.857143T330.285714 898.285714q-88.571429 0-164-43.714285T46.857143 735.428571t-44-164.571428q0-106.285714 62.857143-192.571429-5.142857-29.142857-22.857143-65.428571T0 247.428571h208.571429q85.142857-57.142857 202.857142-89.428571T658.285714 125.714286q128 0 240.571429 32t198.857143 89.714285z" />
        </svg>
      );
    case 'Stripe':
      return (
        <FontAwesomeIcon icon={faStripe} className={style} title={title} />
      );
    case 'Shopify':
      return (
        <FontAwesomeIcon icon={faShopify} className={style} title={title} />
      );
    case 'Github':
      return (
        <FontAwesomeIcon icon={faGithub} className={style} title={title} />
      );
    case 'ph:airplane-light':
      return (
        <FontAwesomeIcon
          icon={faPlaneArrival}
          className={style}
          title={title}
        />
      );
    case 'ph:person-simple-bike-light':
      return (
        <FontAwesomeIcon icon={faBiking} className={style} title={title} />
      );
    case 'ph:users-three-light':
      return <FontAwesomeIcon icon={faUsers} className={style} title={title} />;
    case 'ph:map-trifold-light':
      return <FontAwesomeIcon icon={faMap} className={style} title={title} />;

    case 'ph:clock':
      return <FontAwesomeIcon icon={faClock} className={style} title={title} />;
    // case 'CloudCannon':
    //   return <CloudCannon />;
    case 'circle-flags:pt':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={style}
        >
          <title>{title}</title>
          <mask id="a">
            <circle cx="256" cy="256" r="256" fill="#fff" />
          </mask>
          <g mask="url(#a)">
            <path fill="#6da544" d="M0 512h167l37.9-260.3L167 0H0z" />
            <path fill="#d80027" d="M512 0H167v512h345z" />
            <circle cx="167" cy="256" r="89" fill="#ffda44" />
            <path
              fill="#d80027"
              d="M116.9 211.5V267a50 50 0 1 0 100.1 0v-55.6H117z"
            />
            <path
              fill="#eee"
              d="M167 283.8c-9.2 0-16.7-7.5-16.7-16.7V245h33.4v22c0 9.2-7.5 16.7-16.7 16.7z"
            />
          </g>
        </svg>
      );
    case 'circle-flags:us':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={style}
        >
          <title>{title}</title>
          <mask id="a">
            <circle cx="256" cy="256" r="256" fill="#fff" />
          </mask>
          <g mask="url(#a)">
            <path
              fill="#eee"
              d="M0 256L256 0h256v55.7l-20.7 34.5 20.7 32.2v66.8l-21.2 32.7L512 256v66.8l-24 31.7 24 35.1v66.7l-259.1 28.3L0 456.3v-66.7l27.1-33.3L0 322.8z"
            />
            <path
              fill="#d80027"
              d="M256 256h256v-66.8H236.9zm-19.1-133.6H512V55.7H236.9zM512 512v-55.7H0V512zM0 389.6h512v-66.8H0z"
            />
            <path fill="#0052b4" d="M0 0h256v256H0z" />
            <path
              fill="#eee"
              d="M15 14.5L6.9 40H-20L1.7 55.8l-8.3 25.5L15 65.5l21.6 15.8-8.2-25.4L50.2 40H23.4zm91.8 0L98.5 40H71.7l21.7 15.8-8.3 25.5 21.7-15.8 21.7 15.8-8.3-25.4L142 40h-26.8zm91.9 0l-8.3 25.6h-26.8l21.7 15.8-8.3 25.5 21.7-15.8 21.6 15.7-8.2-25.3 21.7-16H207zM15 89.2l-8.3 25.5H-20l21.7 15.8-8.3 25.5L15 140l21.6 15.7-8.2-25.3 21.7-16H23.4zm91.8 0l-8.3 25.5H71.8l21.7 15.8-8.3 25.5 21.7-15.8 21.6 15.7-8.2-25.3 21.7-16h-26.8zm91.8 0l-8.3 25.5h-26.8l21.7 15.8-8.3 25.5 21.7-15.8 21.6 15.7-8.2-25.3 21.7-16H207zM15 163.6l-8.3 25.5H-20L1.6 205l-8.3 25.5L15 214.6l21.7 15.8-8.3-25.4 21.7-15.9H23.3zm91.8 0l-8.3 25.5H71.7L93.4 205l-8.3 25.5 21.7-15.8 21.7 15.8-8.3-25.4 21.7-15.9h-26.8zm91.8 0l-8.3 25.5h-26.8l21.7 15.8-8.3 25.5 21.7-15.8 21.7 15.8L212 205l21.7-15.9H207z"
            />
          </g>
        </svg>
      );
    default:
      return <div>{icon}</div>;
  }
}
