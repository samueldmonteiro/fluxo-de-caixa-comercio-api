import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateMiddleware } from "../middlewares/validate.middleware";
import { createLoginSchema } from "../schemas/login.schema";
import { MovementController } from "../controllers/movement.controller";
import { storeMovementSchema } from "../schemas/movement/storeMovement.schema";
import { updateMovementSchema } from "../schemas/movement/updateMovement.schema";
import { movementMetricsSchema } from "../schemas/user/movementMetrics.schema";
import { storeCategorySchema } from "../schemas/category/storeCategory.schema";
import { CategoryController } from "../controllers/category.controller";
import { updateCategorySchema } from "../schemas/category/updateCategory.schema";

const routes = Router();

// CONTROLLERS
const userController = container.resolve(UserController);
const authController = container.resolve(AuthController);
const movementController = container.resolve(MovementController);
const categoryController = container.resolve(CategoryController);


/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Teste básico da API
 *     responses:
 *       200:
 *         description: API funcionando
 */
routes.get('/', (req, res: Response) => res.json({ message: 'API OK!' }));

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Endpoint de teste (ping/pong)
 *     responses:
 *       200:
 *         description: Pong retornado com sucesso
 */
routes.get('/ping', (req, res: Response) => res.json({ pong: true }));

// AUTH
/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Login de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
routes.post('/auth', validateMiddleware(createLoginSchema), authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   post:
 *     summary: Retorna informações do usuário logado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *       401:
 *         description: Não autorizado
 */
routes.post('/auth/me', authMiddleware, authController.me);


// ME
/**
 * @swagger
 * /api/me/movements:
 *   get:
 *     summary: Retorna todos os movimentos do usuário logado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Objeto com campo data com lista de movimentacoes, e campo pagination para paginação
 *         
 */
routes.get('/me/movements', authMiddleware, userController.movements);

/**
 * @swagger
 * /api/me/movements/metrics:
 *   get:
 *     summary: Retorna métricas dos movimentos do usuário
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *     responses:
 *       200:
 *         description: Métricas calculadas
 */
routes.get(
  '/me/movements/metrics',
  [authMiddleware, validateMiddleware(movementMetricsSchema, 'query')],
  userController.movementMetrics
);

/**
 * @swagger
 * /api/me/movements/{id}:
 *   get:
 *     summary: Retorna um movimento específico do usuário
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do movimento
 *     responses:
 *       200:
 *         description: Movimento retornado
 *       404:
 *         description: Movimento não encontrado
 */
routes.get('/me/movements/:id', authMiddleware, userController.movement);



/**
 * @swagger
 * /api/me/categories:
 *   get:
 *     summary: Retorna todas as categorias do usuário logado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado
 */
routes.get(
  '/me/categories',
  [authMiddleware],
  userController.categories
);

/**
 * @swagger
 * /api/me/categories/{id}:
 *   get:
 *     summary: Retorna uma categoria específica do usuário
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Categoria retornada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
routes.get(
  '/me/categories/:id',
  [authMiddleware],
  userController.category
);

/**
 * @swagger
 * /api/me/categories/{id}/movements:
 *   get:
 *     summary: Retorna todos os movimentos de uma categoria específica
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Lista de movimentos da categoria
 *         content:
 *           application/json:
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
routes.get(
  '/me/categories/:id/movements',
  [authMiddleware],
  userController.categoryMovements
);



// MOVEMENTS
/**
 * @swagger
 * /api/movements:
 *   post:
 *     summary: Cria um novo movimento
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Movimento criado com sucesso
 */
routes.post(
  '/movements',
  [authMiddleware, validateMiddleware(storeMovementSchema)],
  movementController.store
);

/**
 * @swagger
 * /api/movements/{id}:
 *   put:
 *     summary: Atualiza um movimento existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Movimento atualizado com sucesso
 *       404:
 *         description: Movimento não encontrado
 */
routes.put(
  '/movements/:id',
  [authMiddleware, validateMiddleware(updateMovementSchema)],
  movementController.update
);

/**
 * @swagger
 * /api/movements/{id}:
 *   delete:
 *     summary: Deleta um movimento
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Movimento deletado com sucesso
 *       404:
 *         description: Movimento não encontrado
 */
routes.delete('/movements/:id', [authMiddleware], movementController.delete);

// CATEGORY

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
routes.post(
  '/categories',
  [authMiddleware, validateMiddleware(storeCategorySchema)],
  categoryController.store
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 */
routes.put(
  '/categories/:id',
  [authMiddleware, validateMiddleware(updateCategorySchema)],
  categoryController.update
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da categoria
 *     responses:
 *       204:
 *         description: Categoria deletada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Categoria não pode ser deletada pois possui movimentos associados
 */
routes.delete(
  '/categories/:id',
  [authMiddleware],
  categoryController.delete
);

export default routes;
