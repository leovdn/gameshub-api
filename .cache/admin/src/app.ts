import logo from './extensions/images/logo.svg'
import favicon from './extensions/images/favicon.png'

export default {
  config: {
    auth: {
      logo,
    },
    head: {
      title: 'Admin Teste Leovdn',
      favicon: favicon,
      logo
    },
    menu: {
      logo
    },
    locales: [
      'pt-BR',
    ],
    translations: {
      en: {
        "Auth.form.welcome.title": "Welcome to GameHub",
        "Auth.form.welcome.subtitle": "Log in to your Gamehub account",
      }
    },
    tutorials: false,
  },
  bootstrap(app: any) {
    console.log(app);
  },
};
