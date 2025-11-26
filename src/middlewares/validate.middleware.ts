import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { treeifyError } from "zod";

export function validateMiddleware(
  schema: ZodType<unknown>,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const treeifiedErrors = treeifyError(result.error);

      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Dados de entrada inválidos",
        details: treeifiedErrors,
        timestamp: new Date().toISOString(),
      });
    }

    req.validated = result.data;

    next();
  };
}
