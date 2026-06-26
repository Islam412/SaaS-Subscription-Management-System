import { Controller, Get, Post, Put, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @GetUser('tenantId') tenantId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(tenantId, dto);
  }

  @Get()
  findAll(@GetUser('tenantId') tenantId: string) {
    return this.subscriptionsService.findAll(tenantId);
  }

  @Get('active')
  getActive(@GetUser('tenantId') tenantId: string) {
    return this.subscriptionsService.getActiveSubscriptions(tenantId);
  }

  @Get(':id')
  findOne(
    @GetUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.findOne(tenantId, id);
  }

  @Put(':id')
  update(
    @GetUser('tenantId') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(tenantId, id, dto);
  }

  @Patch(':id/cancel')
  cancel(
    @GetUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.cancel(tenantId, id);
  }

  @Delete(':id')
  remove(
    @GetUser('tenantId') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.subscriptionsService.remove(tenantId, id);
  }
}