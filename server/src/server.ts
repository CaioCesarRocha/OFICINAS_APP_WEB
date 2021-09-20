import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import {errors} from 'celebrate';

const app = express()

app.use(cors()); //pra autorizar quais urls terao acesso a aplicação
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors()); //lida automaticamente com a forma que retornamos o erro no front

app.listen(3333);