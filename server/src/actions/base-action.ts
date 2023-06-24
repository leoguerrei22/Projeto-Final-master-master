//src/actions/base-action.ts
import { Request, Response } from "express";

export interface CrudServiceInterface {
    getAll: () => Promise<any[]>;
    getAllOrder?: () => Promise<any[]>;
    getById: (id: number) => Promise<any>;
    create: (body: any) => Promise<any>;
    update: (id: number, body: any) => Promise<any>;
    delete: (id: number) => Promise<any>;
    authenticate: (email: string, password: string) => Promise<any>;
    addOrderToReservation?: (reservationId: number, order: any, products: any[]) => Promise<any>;
    generateInvoiceForReservation?: (reservationId: number, invoice: any) => Promise<any>;
    getAvailableTables?: (date: Date, hour: string) => Promise<any>;
    createReservation?: (data: any) => Promise<any>;
    getAllReservation?: () => Promise<any[]>;
    getAllInvoices?:() => Promise<any[]>;
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


  async addOrderToReservation(req: Request, res: Response) {
    if (!this.service.addOrderToReservation) {
      return res.status(500).json({ message: 'This operation is not supported.' });
    }

    const { id } = req.params;
    const order = req.body.order;
    const products = req.body.products;

    try {
      const result = await this.service.addOrderToReservation(+id, order, products);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  async generateInvoiceForReservation(req: Request, res: Response) {
    if (!this.service.generateInvoiceForReservation) {
      return res.status(500).json({ message: 'This operation is not supported.' });
    }

    const { id } = req.params;

const invoice = req.body;

    try {
      const result = await this.service.generateInvoiceForReservation(+id, invoice);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAvailableTables(req: Request, res: Response) {
    if (!this.service.getAvailableTables) {
        return res.status(500).json({ message: 'This operation is not supported.' });
    }

    const { date, hour } = req.query;

    try {
        const availableTables = await this.service.getAvailableTables(new Date(date as string), hour as string);
        console.log(availableTables);
        return res.status(200).json(availableTables);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async createReservation(req: Request, res: Response) {
    if (!this.service.createReservation) {
        return res.status(500).json({ message: 'This operation is not supported.' });
    }

    try {
        const reservation = await this.service.createReservation(req.body);
        return res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async getAllReservation(req: Request, res: Response) {
    try {
        const result = await this.service.getAllReservation();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async getAllOrder(req: Request, res: Response) {
    try {
        const result = await this.service.getAllOrder();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
async getAllInvoices(req: Request, res: Response) {
    try {
        const result = await this.service.getAllInvoices();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

}