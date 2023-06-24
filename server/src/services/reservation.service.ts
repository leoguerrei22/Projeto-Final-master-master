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

    async getAvailableTables(date: Date, hour: string) {
      const reservationDate = new Date(date);
    const reservationDateTime = new Date(reservationDate.getUTCFullYear(), reservationDate.getUTCMonth(), reservationDate.getUTCDate(), parseInt(hour.split(':')[0]), parseInt(hour.split(':')[1]));

      return this.prisma.table.findMany({
          where: {
              reservationTables: {
                  none: {
                      reservation: {
                          date: {
                              equals: reservationDateTime,
                          },
                      },
                  },
              },
          },  
      });

    }
    async createReservation(data: any) {
      const { tableId, ...reservationData } = data;
    
      // Primeiro, crie a reserva
      const newReservation = await this.prisma.reservation.create({
        data: reservationData
      });
    
      // Em seguida, crie uma nova entrada em ReservationTable para associar a reserva à mesa
      await this.prisma.reservationTable.create({
        data: {
          reservationId: newReservation.id,
          tableId
        }
      });
    
      return newReservation;
    }

    async getAllReservation() {
      return await this.prisma.reservation.findMany({
        include: {
          user: true,
          reservationTables: {
            include: {
              table: true
            }
          },
          orders: { // incluindo informações de pedidos
            include: {
              orderProducts: { // incluindo relação de produtos do pedido
                include: {
                  product: true // incluindo informações do produto
                }
              }
            }
          }
        }
      });
    }

    async getAllOrder() {
      return await this.prisma.order.findMany({
        include: {
          reservation: {
            include: {
              reservationTables: {
                include: {
                  table: true
                }
              }
            }
          },
          orderProducts: {
            include: {
              product: true
            }
          }
        }
      });
    }

    async getAllInvoices(): Promise<Invoice[]> {
      return await this.prisma.invoice.findMany({
        include: {
          reservation: {
            include: {
              user: true,
              reservationTables: {
                include: {
                  table: true,
                },
              },
              orders: {
                include: {
                  orderProducts: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
    async getInvoiceById(invoiceId: number): Promise<Invoice | null> {
      return await this.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
          reservation: {
            include: {
              user: true,
              reservationTables: {
                include: {
                  table: true,
                },
              },
              orders: {
                include: {
                  orderProducts: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
  }    


    

    
