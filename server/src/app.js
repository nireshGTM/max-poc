import express, { json, urlencoded } from 'express';
import multer from 'multer';
import * as dotenv from 'dotenv';
import initServices from './services/';
import multerConfig from './common/multer_config';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8001;

app.use(json())
app.use(urlencoded({ extended : true }))
app.use(multer(multerConfig).any());

initServices(app); //Initializing services
0
app.use(express.static("uploads"));
app.set('/bule_print', express.static('uploads/bule_print'))
app.set('/design', express.static('uploads/design'))

app.get('/', async (req, res) => {
    res.json({ status: true, message: "Our node.js app works" })
});

// app.post('/', async (req, res) => {
//     res.json({ status: true, message: "Our node.js app works" })
// });

app.use((error, req, res, next) => {
    console.log('This is the rejected field ->', error.field);
  });
  
app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
