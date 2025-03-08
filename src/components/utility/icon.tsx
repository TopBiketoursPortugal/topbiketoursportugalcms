import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  faRss
} from '@fortawesome/free-solid-svg-icons';

import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';

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
import type { IconNames } from '~/types';
import { cn } from 'utils/cn';

export default function Icon({
  icon,
  class: className
}: {
  icon: IconNames;
  class?: string;
}) {
  const style = cn('h-6 w-6', className);
  switch (icon) {
    case 'ph:rss-light':
      return <FontAwesomeIcon icon={faRss} className={style} />;
    case 'ph:star-fill':
      return <FontAwesomeIcon icon={faStar} className={style} />;
    case 'ph:star-light':
      return <FontAwesomeIcon icon={faStarOutline} className={style} />;
    case 'ph:star-half-fill':
      return <FontAwesomeIcon icon={faStarHalf} className={style} />;
    case 'Language':
      return <FontAwesomeIcon icon={faLanguage} className={style} />;
    case 'Envelope':
    case 'ph:envelope-simple-thin':
      return <FontAwesomeIcon icon={faEnvelope} className={style} />;
    case 'User':
      return <FontAwesomeIcon icon={faUser} className={style} />;
    case 'Bread':
      return <FontAwesomeIcon icon={faBreadSlice} className={style} />;
    case 'Mug':
      return <FontAwesomeIcon icon={faMugSaucer} className={style} />;
    case 'Egg':
      return <FontAwesomeIcon icon={faEgg} className={style} />;
    case 'Utensils':
      return <FontAwesomeIcon icon={faUtensils} className={style} />;
    case 'Carrot':
      return <FontAwesomeIcon icon={faCarrot} className={style} />;
    case 'Burger':
      return <FontAwesomeIcon icon={faBurger} className={style} />;
    case 'Fish':
      return <FontAwesomeIcon icon={faFish} className={style} />;
    case 'Seedling':
      return <FontAwesomeIcon icon={faSeedling} className={style} />;
    case 'WheatAwn':
      return <FontAwesomeIcon icon={faWheatAwn} className={style} />;
    case 'PlateWheat':
      return <FontAwesomeIcon icon={faPlateWheat} className={style} />;
    case 'PizzaSlice':
      return <FontAwesomeIcon icon={faPizzaSlice} className={style} />;
    case 'PepperHot':
      return <FontAwesomeIcon icon={faPepperHot} className={style} />;
    case 'ChampagneGlasses':
      return <FontAwesomeIcon icon={faChampagneGlasses} className={style} />;
    case 'AppleWhole':
      return <FontAwesomeIcon icon={faAppleWhole} className={style} />;
    case 'BowlRice':
      return <FontAwesomeIcon icon={faBowlRice} className={style} />;
    case 'Check':
      return <FontAwesomeIcon icon={faCheck} className={style} />;
    case 'CircleCheck':
      return <FontAwesomeIcon icon={faCircleCheck} className={style} />;
    case 'ArrowRight':
      return <FontAwesomeIcon icon={faArrowRight} className={style} />;
    case 'ArrowLeft':
      return <FontAwesomeIcon icon={faArrowLeft} className={style} />;
    case 'ArrowDown':
      return <FontAwesomeIcon icon={faArrowDown} className={style} />;
    case 'ArrowUp':
      return <FontAwesomeIcon icon={faArrowUp} className={style} />;
    case 'CaretLeft':
      return <FontAwesomeIcon icon={faCaretLeft} className={style} />;
    case 'CaretRight':
      return <FontAwesomeIcon icon={faCaretRight} className={style} />;
    case 'CaretDown':
      return <FontAwesomeIcon icon={faCaretDown} className={style} />;
    case 'CaretUp':
      return <FontAwesomeIcon icon={faCaretUp} className={style} />;
    case 'PaperPlane':
      return <FontAwesomeIcon icon={faPaperPlane} className={style} />;
    case 'CartShopping':
      return <FontAwesomeIcon icon={faCartShopping} className={style} />;
    case 'Shop':
      return <FontAwesomeIcon icon={faShop} className={style} />;
    case 'BagShopping':
      return <FontAwesomeIcon icon={faBagShopping} className={style} />;
    case 'CreditCard':
      return <FontAwesomeIcon icon={faCreditCard} className={style} />;
    case 'Store':
      return <FontAwesomeIcon icon={faStore} className={style} />;
    case 'ShopLock':
      return <FontAwesomeIcon icon={faShopLock} className={style} />;
    case 'Car':
      return <FontAwesomeIcon icon={faCar} className={style} />;
    case 'CircleHalfStroke':
      return <FontAwesomeIcon icon={faCircleHalfStroke} className={style} />;
    case 'LocationDot':
      return <FontAwesomeIcon icon={faLocationDot} className={style} />;
    case 'LocationPin':
      return <FontAwesomeIcon icon={faLocationPin} className={style} />;
    case 'LocationCrosshairs':
      return <FontAwesomeIcon icon={faLocationCrosshairs} className={style} />;
    case 'Gift':
      return <FontAwesomeIcon icon={faGift} className={style} />;
    case 'House':
      return <FontAwesomeIcon icon={faHouse} className={style} />;
    case 'MagnifyingGlass':
      return <FontAwesomeIcon icon={faMagnifyingGlass} className={style} />;
    case 'Image':
      return <FontAwesomeIcon icon={faImage} className={style} />;
    case 'Phone':
    case 'ph:phone-thin':
      return <FontAwesomeIcon icon={faPhone} className={style} />;
    case 'Bars':
      return <FontAwesomeIcon icon={faBars} className={style} />;
    case 'Heart':
      return <FontAwesomeIcon icon={faHeart} className={style} />;
    case 'Xmark':
      return <FontAwesomeIcon icon={faXmark} className={style} />;
    case 'Comment':
      return <FontAwesomeIcon icon={faComment} className={style} />;
    case 'TruckFast':
      return <FontAwesomeIcon icon={faTruckFast} className={style} />;
    case 'FaceSmile':
      return <FontAwesomeIcon icon={faFaceSmile} className={style} />;
    case 'Bell':
      return <FontAwesomeIcon icon={faBell} className={style} />;
    case 'CalendarDays':
      return <FontAwesomeIcon icon={faCalendarDays} className={style} />;
    case 'CircleInfo':
      return <FontAwesomeIcon icon={faCircleInfo} className={style} />;
    case 'Fire':
      return <FontAwesomeIcon icon={faFire} className={style} />;
    case 'Hand':
      return <FontAwesomeIcon icon={faHand} className={style} />;
    case 'Lemon':
      return <FontAwesomeIcon icon={faLemon} className={style} />;
    case 'Bookmark':
      return <FontAwesomeIcon icon={faBookmark} className={style} />;
    case 'Facebook':
    case 'ph:facebook-logo-light':
      return <FontAwesomeIcon icon={faFacebook} className={style} />;
    case 'Instagram':
    case 'ph:instagram-logo-light':
      return <FontAwesomeIcon icon={faInstagram} className={style} />;
    case 'Youtube':
    case 'ph:youtube-logo-light':
      return <FontAwesomeIcon icon={faYoutube} className={style} />;
    case 'Google':
      return <FontAwesomeIcon icon={faGoogle} className={style} />;
    case 'ph:whatsapp-logo-light':
      return <FontAwesomeIcon icon={faWhatsapp} className={style} />;
    case 'ph:x-logo-light':
      return <FontAwesomeIcon icon={faXTwitter} className={style} />;
    // case 'Tripadvisor':
    // case 'fa:tripadvisor':
    //   return <FontAwesomeIcon icon={faTripadvisor} className={style} />;
    case 'Stripe':
      return <FontAwesomeIcon icon={faStripe} className={style} />;
    case 'Shopify':
      return <FontAwesomeIcon icon={faShopify} className={style} />;
    case 'Github':
      return <FontAwesomeIcon icon={faGithub} className={style} />;
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
    case 'circle-flags:pt':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={style}
        >
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
