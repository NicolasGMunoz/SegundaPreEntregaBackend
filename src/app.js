import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { __dirname } from './util.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

try {
    await mongoose.connect('mongodb+srv://nicolasgustavomunoz:I9a9XtetcI2zh15A@cluster55575ap.h52hmgs.mongodb.net/2daPreEntrega?retryWrites=true&w=majority');
    console.log('Base de Datos Conectada');
} catch (error) {
    console.log(error.message);
}

app.listen(8080, () => console.log('Server ON'));