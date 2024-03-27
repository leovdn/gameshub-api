import { factories } from '@strapi/strapi';
import axios from 'axios'
import jsdom from 'jsdom'
import { slugify } from '../../../utils/slugify';

import { GamesList } from '../../../types/gameTypes';

async function getGameInfo(slug: string) {
  const { JSDOM } = jsdom

  const body = await axios.get(`https://www.gog.com/game/${slug}`)
  const dom = new JSDOM(body.data)

  const description = dom.window.document.querySelector('.description')

  return {
    rating: 'BR0',
    short_description: description.textContent.slice(0, 160),
    description: description.innerHTML
  }
}

export default factories.createCoreService('api::game.game', ({ strapi }) => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`

    const { data: { products } } = await axios.get<GamesList>(gogApiUrl)
    // console.log({
    //   name: products[0].publishers[0],
    //   slug: slugify(products[0].publishers[0])
    // })

    await strapi.service('api::publisher.publisher').create({
      data: {
        name: products[0].publishers[0],
        slug: slugify(products[0].publishers[0]),
      }
    })

    await strapi.service('api::developer.developer').create({
      data: {
        name: products[0].developers[0],
        slug: slugify(products[0].developers[0]),
      }
    })
  }
}));
