module.exports = (client) => {
  client.pingStats = () => {
    const ping = client.ws.ping;
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const uptiime = client.uptime;

    return {
      apiLatency: ping,
      memoryUsage: memoryUsage,
      uptime: uptiime,
    };
  };
};
