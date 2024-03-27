/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game.game', ({ strapi }) => ({
  async populate(ctx) {
    try {
      console.log('Initializer')
      ctx.body = 'ok'
    } catch (error) {
      console.log(error)
    }
  }
}));
