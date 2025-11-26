import { inject, injectable } from "tsyringe";
import { MovementService } from "../services/movement.service";
import { StoreMovementDTO } from "../schemas/movement/storeMovement.schema";
import { Request, Response } from "express";
import { UpdateMovementDTO } from "../schemas/movement/updateMovement.schema";

@injectable()
export class MovementController {

  constructor(
    @inject(MovementService) private service: MovementService
  ) { }

  store = async (req: Request, res: Response) => {
    const dto = req.body as StoreMovementDTO;
    return res.json(await this.service.store(dto, req.user.sub));
  }

  update = async (req: Request, res: Response) => {
    const dto = req.body as UpdateMovementDTO;
    return res.json(await this.service.update(dto, req.user.sub, Number(req.params.id)))

  }

  delete = async (req: Request, res: Response) => {
    await this.service.delete(req.user.sub, Number(req.params.id));
    return res.json({ message: "Movimentação deleta com sucesso!" });
  }
}