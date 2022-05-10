
const routes = function routes(server, serviceLocator) {
  const messageController = serviceLocator.get('messageController');
  server.get('/', (req, res) => {
    return res.send({
      success: true,
      message: 'AdaKerja Bot API v1'
    })
  });

  server.get('/webhook', (req, res) => messageController.getWebhook(req, res));

  server.post('/webhook', (req, res) => messageController.postWebhook(req, res));
};

module.exports.setup = routes;
