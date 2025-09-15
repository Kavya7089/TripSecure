const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
