import express, { Request, Response } from "express";
import user from "./user";
import invoice from "./invoice";
import order from "./order";
import reservation from "./reservation";

import products from "./product";
import { name, version } from "../../package.json";

const router = express.Router();

router.get("/", (req: Request, res: Response) =>
  res.json({
    name,
    version,
  })
);

router.use("/user", user);
router.use("/product", products);
router.use("/invoice", invoice);
router.use("/order", order);
router.use("/reservation", reservation);

export default router;