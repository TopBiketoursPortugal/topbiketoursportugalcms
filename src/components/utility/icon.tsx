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
import type { IconNames } from 'src/types';
import { cn } from 'utils/cn';

export default function Icon({
  icon,
  class: className,
  title
}: {
  icon: IconNames;
  class?: string;
  title?: string;
}) {
  const style = cn('h-6 w-6', className);
  switch (icon) {
    case 'ph:rss-light':
      return <FontAwesomeIcon icon={faRss} className={style} title={title} />;
    case 'ph:star-fill':
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
      return (
        <FontAwesomeIcon icon={faCircleCheck} className={style} title={title} />
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
    case 'Bookmark':
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
          className={style}
          viewBox="0 0 1316 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
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
