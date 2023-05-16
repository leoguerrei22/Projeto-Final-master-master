import { Utilizador } from '@prisma/client'

declare global {
  namespace Express {
    export interface Request {
      user: Utilizador;
    }
  }
}