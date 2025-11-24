import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Prefixo de rotas
app.use('/api', routes);

// Middleware 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
  });
});

// Middleware de erro (sempre por último!)
app.use(errorHandler);

export default app;
