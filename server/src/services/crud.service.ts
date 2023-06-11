//src/services/crud.service.ts
import { PrismaClient } from "@prisma/client";
import { CrudServiceInterface } from "../actions/base-action";

export class CrudService implements CrudServiceInterface {

    protected prisma = new PrismaClient();
    protected table: string;

    constructor(table: string) {
        this.table = table;
    }
    async getAll() {
        return this.prisma[this.table].findMany();
    }
  
    async getById(id: number) {
        return this.prisma[this.table].findUnique({ where: { id:id} });
    }
    
    async create(data: any) {
        return this.prisma[this.table].create({ data });
    }
    
    async update(id: number, data: any) {
        return this.prisma[this.table].update({
            where: { id },
            data
          });
    }
  
    async delete(id: number) {
        return this.prisma[this.table].delete({ where: { id } });
    }

    async authenticate(email: string, password: string): Promise<any> {
        throw new Error('Method not implemented.');
      }
}