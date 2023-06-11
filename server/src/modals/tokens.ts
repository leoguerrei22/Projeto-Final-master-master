import { JwtPayload } from "jsonwebtoken";

export interface ExtendedPayload extends JwtPayload{
    user: number ;
}