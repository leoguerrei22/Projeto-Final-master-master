import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken';
import UsersService from '../services/users.service';
import { ExtendedPayload } from "../modals/tokens";

const publicEndpoints = [
  { path: "/user/login", method: "POST" },
  { path: "/user/register", method: "POST" },
];

const usersService = new UsersService();

export function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { path, method } = request;

  if (
    publicEndpoints.findIndex(
      (endpoint) => path === endpoint.path && method === endpoint.method
    ) !== -1
  ) {
    return next();
  }

  const authHeader = request.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({
      code: 401,
      message: "Token not found",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return response.status(500).json({
      code: 500,
      message: "JWT secret not found",
    });
  }

  verify(token, secret, async (error, payload) => {
    if (error) {
      return response.status(403).json({
        code: 403,
        message: error.message,
      });
    }

    const { id } = payload as ExtendedPayload;

    const user = await usersService.getById(id);

    if (!user) {
      return response.status(404).json({
        code: 404,
        message: "User not found",
      });
    }

    request.user = user;
    
    next();
  });
}