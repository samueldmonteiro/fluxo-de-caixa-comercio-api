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

const routes = Router();

// CONTROLLERS
const userController = container.resolve(UserController);
const authController = container.resolve(AuthController);
const movementController = container.resolve(MovementController);

// DEFAULT
routes.get('/', (req, res: Response) => res.json({ message: 'API OK!' }));
routes.get('/ping', (req, res: Response) => res.json({ pong: true }));


// AUTH
routes.post('/auth', validateMiddleware(createLoginSchema), authController.login);
routes.post('/auth/me', authMiddleware, authController.me);


// USER
routes.get('/users', userController.getUsers);
routes.get('/me/movements', authMiddleware, userController.movements);
routes.get('/me/movements/:id', authMiddleware, userController.movement);


// MOVEMENTS
routes.post(
  '/movements',
  [authMiddleware, validateMiddleware(storeMovementSchema)],
  movementController.store
);

routes.put(
  '/movements/:id',
  [authMiddleware, validateMiddleware(updateMovementSchema)],
  movementController.update
);

routes.delete(
  '/movements/:id',
  [authMiddleware],
  movementController.delete
);



export default routes;