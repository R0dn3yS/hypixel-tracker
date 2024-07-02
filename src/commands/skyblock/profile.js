const getUuid = require('mc-player-uuid');

module.exports = {
  name: 'player',
  description: 'Returns player information',
  run: async (client, message, args, hypixel) => {
    const acc = await getUuid(args[0]);

    const playerData = await hypixel.get('/v2/skyblock/profiles', {
      params: {
        uuid: acc.id,
      }
    });

    console.log(playerData.data);
  }
}