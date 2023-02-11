import { PATH_APP } from 'src/routes/paths';

const title = 'Garden of Love';

const email = 'auther-email@gmail.com';

const repository = 'https://gitlab.gardenoflove.ir/aws-front/gol.git';

const messages = {
  app: {
    crash: {
      title: 'Oooops... Sorry, I guess, something went wrong. You can:',
      options: {
        email: `contact with author by this email - ${email}`,
        reset: 'Press here to reset the application',
      },
    },
  },
  loader: {
    fail: 'Hmmmmm, there is something wrong with this component loading process... Maybe trying later would be the best idea',
  },
  images: {
    failed: 'something went wrong during image loading :(',
  },
  404: 'Hey bro? What are you looking for?',
};

const dateFormat = 'MMMM DD, YYYY';

export const placeSearchRadius = 30000;

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 700, // but if it appears, it will stay for at least 700 milliseconds
};

const defaultMetaTags = {
  image: '/cover.png',
  description: 'If you help people, You will get help from somewhere you dont expect',
};

const sizes = {
  lg: 1128,
  icon: 24,
  maxWidth: 1128,
};

const oneByte = 1048576;

const fileLimitations = {
  image: oneByte * 30,
  video: oneByte * 2000,
  videoCount: 5,
  imageCount: 10,
};

const bottomNavbar = {
  height: 64,
};

const localStorageKeys = {
  search: 'search',
};

export {
  loader,
  dateFormat,
  messages,
  repository,
  email,
  title,
  defaultMetaTags,
  sizes,
  fileLimitations,
  bottomNavbar,
  localStorageKeys,
};

export const PATH_AFTER_LOGIN = PATH_APP.root;

export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 64,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: 'themeMode',
  themeDirection: 'themeDirection',
  themeColorPresets: 'themeColorPresets',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch',
};

export const SIZES = {
  lg: 1128,
  icon: 24,
  maxWidth: 1128,
};
