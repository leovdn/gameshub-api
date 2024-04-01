/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game.game', ({ strapi }) => ({
  async populate(ctx) {
    console.log('Starting to populate...')

    const options = {
      order: 'desc:trending',
      productType: 'in:game,pack',
      page: '1',
      ...ctx.query
    }

    await strapi.service('api::game.game').populate(options)

    ctx.send('Finished populating!')
  }
}));
