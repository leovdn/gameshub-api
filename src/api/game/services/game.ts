import { factories } from '@strapi/strapi';
import axios from 'axios'
import jsdom from 'jsdom'
import { slugify } from '../../../utils/slugify';

import { GamesList, Product } from '../../../types/gameTypes';

async function getGameInfo(slug: string) {
  const { JSDOM } = jsdom

  const body = await axios.get(`https://www.gog.com/game/${slug}`)
  const dom = new JSDOM(body.data)

  const description = dom.window.document.querySelector('.description')

  // return {
  //   rating: 'BR0',
  //   short_description: description.textContent.slice(0, 160),
  //   description: description.innerHTML
  // }

  return {
    rating: 'BR0',
    short_description: 'Test short description',
    description: ['Test description', 'test']
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
    await strapi.db.query(`api::${entityName}.${entityName}`).create({
      data: {
        name,
        slug: slugify(name)
      }
    })
  }
}

async function createManyToManyData(products: Product[]) {
  const developers = {}
  const publishers = {}
  const categories = {}
  const platforms = {}

  products.forEach((product) => {
    const { developers: devs, publishers: pubs, genres, operatingSystems } = product

    genres && genres.forEach((genre) => {
      categories[genre.name] = true
    })

    operatingSystems && operatingSystems.forEach((os) => {
      platforms[os] = true
    })

    // developers && developers.forEach((developer) => {
    //   developers[developer] = true
    // })

    // publishers && publishers.forEach((publisher) => {
    //   publishers[publisher] = true
    // })

    developers[devs[0]] = true
    publishers[pubs[0]] = true
  })

  return Promise.all([
    ...Object.keys(developers).map((name) => create(name, 'developer')),
    ...Object.keys(publishers).map((name) => create(name, 'publisher')),
    ...Object.keys(categories).map((name) => create(name, 'category')),
    ...Object.keys(platforms).map((name) => create(name, 'platform')),
  ])
}

async function createGames(products: Product[]) {
  await Promise.all(
    products.map(async (product) => {
      const item = await getByName(product.title, 'game')

      if (!item) {
        console.info(`Creating: ${product.title}...`)

        const game = await strapi.service('api::game.game').create({
          data: {
            name: product.title,
            slug: slugify(product.slug),
            price: product.price.baseMoney.amount,
            release_date: product.releaseDate.replaceAll('.', '-'),
            categories: await Promise.all(
              product.genres.map(genre => getByName(genre.name, "category"))
            ),
            platforms: await Promise.all(
              product.operatingSystems.map(platform => getByName(platform, "platform"))
            ),
            developers: [await getByName(product.developers[0], "developer")],
            publishers: await getByName(product.publishers[0], "publisher"),
            description: 'Test description',
            short_description: 'Test short description',
            // ...await getGameInfo(product.slug)
          }
        })

        return game
      }
    }))
}

export default factories.createCoreService('api::game.game', ({ strapi }) => ({
  async populate(params) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`

    const { data: { products } } = await axios.get<GamesList>(gogApiUrl)

    await createManyToManyData([products[5], products[6]])
    await createGames([products[5], products[6]])

    // create('Test Developer', 'developer')
  }
}));
