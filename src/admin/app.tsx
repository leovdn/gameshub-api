import Icon from "./extensions/logo-black-simple.svg";
import Logo from "./extensions/logo-black.svg";

export default {
  config: {
    auth: {
      logo: Logo,
    },
    head: {
      title: "GameHub Heading Test",
      favicon: Icon,
      logo: Logo,
    },
    locales: [],
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to GameHub!",
        "Auth.form.welcome.subtitle": "Log in to your account",
        "app.components.LeftMenu.navbrand.title": "GameHub Dashboard",
      },
    },
    menu: {
      logo: Icon,
    },
    theme: {
      light: {},
      dark: {
        colors: {
          primary100: "#030415",
          primary600: "#f231a5",
          primary700: "#f231a5",
          neutral0: "#0d102f",
          neutral100: "#030415",
        },
      },
    },
    tutorials: false,
    notifications: {
      releases: false,
    },
  },
  bootstrap() {},
};
