import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    // Get counts from all tables
    const [
      tenants,
      users,
      customers,
      plans,
      subscriptions,
      invoices,
      payments,
      accounts,
      journalEntries,
      journalLines,
    ] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.user.count(),
      this.prisma.customer.count(),
      this.prisma.subscriptionPlan.count(),
      this.prisma.subscription.count(),
      this.prisma.invoice.count(),
      this.prisma.payment.count(),
      this.prisma.account.count(),
      this.prisma.journalEntry.count(),
      this.prisma.journalLine.count(),
    ]);

    // Get recent activity (last 5 records from each table)
    const [recentTenants, recentUsers, recentCustomers] = await Promise.all([
      this.prisma.tenant.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      this.prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
    ]);

    return {
      status: 'success',
      message: 'SaaS Subscription Management System',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        stats: {
          tenants,
          users,
          customers,
          subscriptionPlans: plans,
          subscriptions,
          invoices,
          payments,
          accounts,
          journalEntries,
          journalLines,
        },
        totalRecords: tenants + users + customers + plans + subscriptions + invoices + payments + accounts + journalEntries + journalLines,
        lastUpdated: new Date().toISOString(),
      },
      recentActivity: {
        tenants: recentTenants,
        users: recentUsers,
        customers: recentCustomers,
      },
      links: {
        swagger: '/api/docs',
        prismaStudio: 'http://localhost:5555',
        github: 'https://github.com/Islam412/SaaS-Subscription-Management-System',
      },
    };
  }
}