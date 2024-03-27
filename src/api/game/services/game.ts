/**
 * game service
 */

import { factories } from '@strapi/strapi';
import axios from 'axios'


export default factories.createCoreService('api::game.game', ({ strapi }) => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`

    const { data: { products } } = await axios.get(gogApiUrl)

    console.log(products[0])
  }
}));
