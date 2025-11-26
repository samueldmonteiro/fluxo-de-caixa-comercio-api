import { Application, Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'FLUXO CAIXA API',
      version: '1.0.0',
      description: 'Documentação interativa da API',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts', './src/schemas/**/*.ts'], // Aqui aponta suas rotas e schemas
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: Application) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
}
