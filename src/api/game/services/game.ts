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

async function getByName(name: string, entityName: string) {
  const item = await strapi.db.query(`api::${entityName}.${entityName}`).findOne({
    where: {
      name
    }
  })
  return item ? item : null
}

async function create(name: string, entityName: string) {
  const item = await getByName(name, entityName)

  if (!item) {
    await strapi.service(`api::${entityName}.${entityName}`).create({
      data: {
        name,
        slug: slugify(name)
      }
    })
  }
}

export default factories.createCoreService('api::game.game', ({ strapi }) => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`

    const { data: { products } } = await axios.get<GamesList>(gogApiUrl)

    await create(products[1].publishers[0], 'publisher')
    await create(products[1].developers[0], 'developer')
  }
}));
