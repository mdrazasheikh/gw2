import app from './app';

const {PORT = 8010} = process.env;

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

export default server;