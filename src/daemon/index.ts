import express        from 'express';
import body_parser    from 'body-parser';
import * as Web3OAuth from '../utils/Web3OAuth';

const app = express();
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.post('/oauth2/verify', async function (req, res) {
  try {
    const valid = await Web3OAuth.verifyToken(JSON.parse(Buffer.from(req.body.token, 'base64').toString('ascii')));
    res.send({ valid });
  } catch (error) {
    res.send({ error: error.toString() });
  }
});

app.listen(3000);
