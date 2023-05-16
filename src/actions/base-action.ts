import { Request, Response } from "express";

export interface CrudServiceInterface {
    getAll: () => Promise<any[]>;
    getById: (id: number) => Promise<any>;
    create: (body: any) => Promise<any>;
    update: (id: number, body: any) => Promise<any>;
    delete: (id: number) => Promise<any>;
    authenticate: (email: string, password: string) => Promise<any>;

}

export default class BaseAction {

    private service: CrudServiceInterface;

    constructor(service: CrudServiceInterface) {
        this.service = service;
    }

    async all(req: Request, res: Response) {
        try {
            const result = await this.service.getAll();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async detail(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await this.service.getById(+id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const result = await this.service.create(req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const result = await this.service.update(+id, req.body);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await this.service.delete(+id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async authenticate(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const token = await this.service.authenticate(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}