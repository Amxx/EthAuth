import express     from 'express';
import body_parser from 'body-parser';
// import { TokenManager } from '../utils/EthAuth';

const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.post('/oauth2/verify', async function (req, res) {
  try {
    // const result = await TokenManager.verifyToken(req.body.token);
    const result = true
    res.send(result);
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

app.listen(3000);
