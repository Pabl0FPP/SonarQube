import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Delete, Put, ParseUUIDPipe, Res, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Role } from '../common/role.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { OrderItemType } from './entities/order-item.entity';
import { OrderStatus } from './entities/order.entity';
@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Cart endpoints
  @Get('cart')
  @Auth(Role.USER, Role.ADMIN)
  async getCart(@Request() req) {
    return await this.ordersService.getCart(req.user);
  }

  @Post('cart/items')
  @Auth(Role.USER, Role.ADMIN)
  async addItemToCart(
    @Request() req,
    @Body() body: { itemType: OrderItemType; itemId: string; quantity: number }
  ) {
    return await this.ordersService.addItemToCart(
      req.user,
      body.itemType,
      body.itemId,
      body.quantity
    );
  }

  @Delete('cart/items/:itemId')
  @Auth(Role.USER, Role.ADMIN)
  async removeItemFromCart(@Request() req, @Param('itemId', ParseUUIDPipe) itemId: string) {
    return await this.ordersService.removeItemFromCart(req.user, itemId);
  }

  @Put('cart/items/:itemId')
  @Auth(Role.USER, Role.ADMIN)
  async updateItemQuantity(
    @Request() req,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() body: { quantity: number }
  ) {
    return await this.ordersService.updateItemQuantity(
      req.user,
      itemId,
      body.quantity
    );
  }

  // Order endpoints
  @Get()
  @Auth(Role.USER, Role.ADMIN)
  async getUserOrders(@Request() req) {
    return await this.ordersService.getUserOrders(req.user);
  }

  @Post('cart/checkout')
  @Auth(Role.USER, Role.ADMIN)
  async createPayment(@Request() req) {
    const cart = await this.ordersService.getCart(req.user);
    return await this.ordersService.createPaymentPreference(cart.id);
  }

  @Patch('cart/address')
  @Auth(Role.USER, Role.ADMIN)
  async addAddressToOrder(@Request() req, @Body() body: { address: string }) {
    return await this.ordersService.addAddressToOrder(req.user.id, body.address);
  }

  // MercadoPago webhook endpoint
  @Post('webhook/mercadopago')
  async handleMercadoPagoWebhook(
    @Body() body: { data: { id: string }; type: string }
  ) {
    if (body.type === 'payment') {
      await this.ordersService.handleMercadoPagoWebhook(body.data.id, 'approved');
    }
  }

  @Get('payment/success')
  async handlePaymentSuccess(
    @Query('external_reference') orderId: string,
    @Res() res
  ) {
    console.log('Payment success - Order ID:', orderId);
    try {
      if (orderId) {
        await this.ordersService.updateOrderStatus(orderId, OrderStatus.PAID);
        console.log('Order status updated to PAID');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }

    res.send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #4CAF50;">¡Pago Exitoso!</h1>
            <p>Tu orden ha sido pagada correctamente.</p>
            <p>ID de la orden: ${orderId || 'No disponible'}</p>
          </div>
        </body>
      </html>
    `);
  }

  @Get('payment/failure')
  async handlePaymentFailure(
    @Query('external_reference') orderId: string,
    @Res() res
  ) {
    console.log('Payment failure - Order ID:', orderId);
    try {
      if (orderId) {
        await this.ordersService.updateOrderStatus(orderId, OrderStatus.CART);
        console.log('Order status updated to CART');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }

    res.send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #f44336;">Pago Fallido</h1>
            <p>Hubo un problema con tu pago. Por favor, intenta nuevamente.</p>
            <p>ID de la orden: ${orderId || 'No disponible'}</p>
          </div>
        </body>
      </html>
    `);
  }

  @Get('payment/pending')
  async handlePaymentPending(
    @Query('external_reference') orderId: string,
    @Res() res
  ) {
    console.log('Payment pending - Order ID:', orderId);
    res.send(`
      <html>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #ff9800;">Pago Pendiente</h1>
            <p>Tu pago está siendo procesado.</p>
            <p>ID de la orden: ${orderId || 'No disponible'}</p>
          </div>
        </body>
      </html>
    `);
  }
}
  