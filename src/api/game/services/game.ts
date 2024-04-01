import { factories } from '@strapi/strapi';
import axios from 'axios'
import jsdom from 'jsdom'
import FormData from 'form-data'
import { slugify } from '../../../utils/slugify';
import queryString from 'querystring'
import { GamesList, Product } from '../../../types/gameTypes';

function Exception(e: { data: { errors: any; }; details: any; }) {
  return { e, data: e.data && e.data.errors && e.data.errors && e.details };
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getGameInfo(slug: string) {
  const { JSDOM } = jsdom

  try {
    const body = await axios.get(`https://www.gog.com/game/${slug}`)
    const dom = new JSDOM(body.data)

    const description = dom.window.document.querySelector('.description')

    return {
      rating: 'BR0',
      short_description: description.textContent.slice(0, 160),
      description: description.innerHTML,
    }

  } catch (error) {
    console.log("getGameInfo", Exception(error))
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

async function setImage({ image, game, field = "cover" }) {
  try {
    const url = `${image}`
    const { data } = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(data, "base64")

    const formData = new FormData()

    formData.append("refId", game.id)
    formData.append("ref", "api::game.game")
    formData.append("field", field)
    formData.append("files", buffer, { filename: `${game.slug}.jpg` })

    console.info(`Uploading: ${field} image ${game.slug}.jpg ...`)

    await axios({
      method: "POST",
      url: `http://localhost:${strapi.config.port}/api/upload`, //CHANGE PORST FROM ENV FILE IN CASE OF PRODUCTION
      data: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      },
    })

  } catch (error) {
    console.log("setImage", Exception(error))
  }

}

async function createGames(products: Product[]) {
  await Promise.all(
    products.map(async (product) => {
      const item = await getByName(product.title, 'game')

      if (!item) {
        console.info(`Creating: ${product.title}...`)

        const game = await strapi.db.query('api::game.game').create({
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
            ...await getGameInfo(product.slug)
          }
        })

        await setImage({ image: product.coverHorizontal, game })
        await Promise.all(product.screenshots.slice(0, 5).map(imageUrl => {
          const fixedUrl = imageUrl.replace('_{formatter}', '')
          setImage({ image: fixedUrl, game, field: "gallery" })

        }))

        await timeout(2000);

        return game
      }
    }))
}

export default factories.createCoreService('api::game.game', ({ }) => ({
  async populate(params: any) {
    const gogApiUrl = `https://catalog.gog.com/v1/catalog?${queryString.stringify(params)}`

    try {
      const { data: { products } } = await axios.get<GamesList>(gogApiUrl)
      await createManyToManyData(products)
      await createGames(products)

    } catch (error) {
      console.log('error', Exception(error))
    }
  }
}));
