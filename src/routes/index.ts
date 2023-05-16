import express, { Request, Response } from "express";
import utilizadores from "./utilizadores";
import fatura from "./fatura";
import pedidos from "./pedidos";
import reserva from "./reserva";

import products from "./products";
import { name, version } from "../../package.json";

const router = express.Router();

router.get("/", (req: Request, res: Response) =>
  res.json({
    name,
    version,
  })
);

router.use("/utilizadores", utilizadores);
router.use("/produtos", products);
router.use("/fatura", fatura);
router.use("/pedidos", pedidos);
router.use("/reserva", reserva);

export default router;