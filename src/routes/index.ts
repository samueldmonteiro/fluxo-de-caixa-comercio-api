import { Request, Response, Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const routes = Router();

const userController = container.resolve(UserController);
const authController = container.resolve(AuthController);


// DEFAULT
routes.get('/', (req, res: Response) => res.json({ message: 'API OK!' }));
routes.get('/ping', (req, res: Response) => res.json({ pong: true }));


// AUTH
routes.post('/auth', authController.login);
routes.post('/auth/me', authMiddleware, authController.me);


// USER
routes.get('/users', userController.getUsers);


export default routes;