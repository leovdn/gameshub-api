export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'POST',
      path: '/games/populate',
      handler: 'game.populate',
      config: {
        auth: false,
        policies: []
      }
    },
  ]
}
