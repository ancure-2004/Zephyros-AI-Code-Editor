import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoder({extender: true}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app;