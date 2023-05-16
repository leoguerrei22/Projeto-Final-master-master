import bcrypt from 'bcrypt';
import { CrudService } from './crud.service';
import jwt from 'jsonwebtoken';

export default class UsersService extends CrudService {

  constructor() {
    super('utilizadores');
  }
  
  async create(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.utilizador.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });
  }
  
  async update(id: number, dto: any) {
    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashedPassword;
    }
    return this.prisma.utilizador.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async authenticate(email: string, password: string) {
    const user = await this.prisma.utilizador.findUnique({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT secret not found');
      }
      const token = jwt.sign({ id: user.id }, secret, {
        expiresIn: 86400, // expires in 24 hours
      });

      return token;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  verifyToken(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret not found');
    }
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
