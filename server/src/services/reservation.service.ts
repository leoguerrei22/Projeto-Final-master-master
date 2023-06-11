import { PrismaClient, Reservation, Order, Product, OrderProduct, Invoice } from '@prisma/client';
import { CrudService } from './crud.service';

export default class ReservationService extends CrudService {
  constructor(table: string) {
    super(table);
    this.prisma = new PrismaClient();
  }

// Adicionar um pedido a uma reserva existente
async addOrderToReservation(reservationId: number, order: Order, products: { product: Product, quantity: number }[]): Promise<Order> {
    const reservation = await this.prisma.reservation.findUnique({ where: { id: reservationId }});
    if (!reservation) throw new Error('Reservation not found');
    const newOrder = await this.prisma.order.create({
        data: {
            reservation: {
                connect: {
                    id: reservation.id
                },
            },
            orderProducts: {
                create: products.map((product) => ({
                    product: {
                        connect: {
                            id: product.product.id
                        },
                    },
                    quantity: product.quantity,
                })),
            },
            observations: order.observations,

        },
        include: {
            orderProducts: {
                include: {
                    product: true,
                },
            },
        },
    });
    return newOrder;
}


async generateInvoiceForReservation(reservationId: number, invoice: Invoice): Promise<Invoice> {
  const reservation = await this.prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { orders: {
      include: {
        orderProducts: {
          include: {
            product: true,
          }
        }
      }
    } 
  },
});

if (!reservation) {
  throw new Error('Reservation not found');
}

const createdInvoice = await this.prisma.invoice.create({
  data: {
    billingDetails: invoice.billingDetails,
    paymentMethod: invoice.paymentMethod,
    observations: invoice.observations,
    paymentStatus: invoice.paymentStatus,
    reservation: {
      connect: {
        id: reservation.id,
      },
    },
  },
});

return createdInvoice;
}
}