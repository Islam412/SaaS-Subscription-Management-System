import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InvoiceStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, dto: CreatePaymentDto) {
    // Check if invoice exists and belongs to tenant
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id: dto.invoiceId,
        tenantId,
      },
      include: {
        subscription: {
          include: {
            customer: true,
            plan: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid');
    }

    if (dto.amount !== Number(invoice.totalAmount)) {
      throw new BadRequestException('Payment amount does not match invoice total');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Create payment
      const payment = await prisma.payment.create({
        data: {
          amount: dto.amount,
          currency: 'USD',
          paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
          method: dto.method || 'CASH',
          reference: dto.reference,
          status: PaymentStatus.COMPLETED,
          invoiceId: dto.invoiceId,
          tenantId,
        },
        include: {
          invoice: {
            include: {
              subscription: {
                include: {
                  customer: true,
                  plan: true,
                },
              },
            },
          },
        },
      });

      // Update invoice status to PAID
      await prisma.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          status: InvoiceStatus.PAID,
          paidAt: new Date(),
        },
      });

      // Create accounting entries
      // Debit: Cash (1000)
      // Credit: Accounts Receivable (1100)
      const journalEntry = await prisma.journalEntry.create({
        data: {
          description: `Payment for invoice ${invoice.invoiceNumber}`,
          reference: payment.id,
          tenantId,
          lines: {
            create: [
              {
                type: 'DEBIT',
                amount: dto.amount,
                accountId: await this.getAccountId(prisma, tenantId, '1000'), // Cash
              },
              {
                type: 'CREDIT',
                amount: dto.amount,
                accountId: await this.getAccountId(prisma, tenantId, '1100'), // Accounts Receivable
              },
            ],
          },
        },
      });

      // Link journal entry to payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          journalEntryId: journalEntry.id,
        },
      });

      return payment;
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.payment.findMany({
      where: { tenantId },
      include: {
        invoice: {
          include: {
            subscription: {
              include: {
                customer: true,
                plan: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        invoice: {
          include: {
            subscription: {
              include: {
                customer: true,
                plan: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private async getAccountId(prisma: any, tenantId: string, code: string) {
    const account = await prisma.account.findFirst({
      where: {
        code,
        tenantId,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with code ${code} not found`);
    }

    return account.id;
  }
}
