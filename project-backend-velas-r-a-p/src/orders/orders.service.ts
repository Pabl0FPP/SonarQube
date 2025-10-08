import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem, OrderItemType } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';
import { Candle } from '../candle/entities/candle.entity';
import { ExtraProduct } from '../extra-product/entities/extra-product.entity';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class OrdersService {
  private mercadopago: MercadoPagoConfig;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Candle)
    private readonly candleRepository: Repository<Candle>,
    @InjectRepository(ExtraProduct)
    private readonly extraProductRepository: Repository<ExtraProduct>,
  ) {
    this.mercadopago = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || ''
    });
  }

  async getOrCreateCart(user: User): Promise<Order> {
    // First check if there's a pending payment
    const pendingOrder = await this.orderRepository.findOne({
      where: {
        user: { id: user.id },
        status: OrderStatus.PENDING_PAYMENT
      },
      relations: ['items', 'user']
    });

    // If there's a pending order, convert it back to cart
    if (pendingOrder) {
      pendingOrder.status = OrderStatus.CART;
      pendingOrder.mercadoPagoPreferenceId = undefined;
      return await this.orderRepository.save(pendingOrder);
    }

    // Look for an existing cart or create a new one
    let cart = await this.orderRepository.findOne({
      where: {
        user: { id: user.id },
        status: OrderStatus.CART
      },
      relations: ['items', 'user']
    });

    if (!cart) {
      cart = this.orderRepository.create({
        user,
        status: OrderStatus.CART,
        items: [],
        total: 0
      });
      await this.orderRepository.save(cart);
    }

    return cart;
  }

  async addAddressToOrder(userId: string, address: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where:{ user: { id: userId }, status: OrderStatus.CART } });
    if (!order) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }
    order.address = address;
    return await this.orderRepository.save(order);
  }

  async addItemToCart(
    user: User,
    itemType: OrderItemType,
    itemId: string,
    quantity: number
  ): Promise<Order> {
    const cart = await this.getOrCreateCart(user);
    let unitPrice: number;

    if (itemType === OrderItemType.CANDLE) {
      const candle = await this.candleRepository.findOne({ where: { id: itemId } });
      if (!candle) {
        throw new NotFoundException(`Candle with ID ${itemId} not found`);
      }
      unitPrice = candle.price;
    } else {
      const extraProduct = await this.extraProductRepository.findOne({ where: { id: itemId } });
      if (!extraProduct) {
        throw new NotFoundException(`Extra product with ID ${itemId} not found`);
      }
      unitPrice = extraProduct.price;
    }

    let orderItem = cart.items.find(i => 
      i.itemType === itemType && i.productId === itemId
    );

    if (orderItem) {
      orderItem.quantity += quantity;
      orderItem.totalPrice = orderItem.quantity * unitPrice;
    } else {
      orderItem = this.orderItemRepository.create({
        order: cart,
        itemType,
        productId: itemId,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice
      });

      cart.items.push(orderItem);
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return await this.orderRepository.save(cart);
  }

  async removeItemFromCart(user: User, itemId: string): Promise<Order> {
    const cart = await this.getOrCreateCart(user);
    const itemIndex = cart.items.findIndex(i => i.productId === itemId);

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.orderItemRepository.remove(cart.items[itemIndex]);
    cart.items.splice(itemIndex, 1);
    cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return await this.orderRepository.save(cart);
  }

  async updateItemQuantity(
    user: User,
    itemId: string,
    quantity: number
  ): Promise<Order> {
    const cart = await this.getOrCreateCart(user);
    const orderItem = cart.items.find(i => i.productId === itemId);

    if (!orderItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      return this.removeItemFromCart(user, itemId);
    }

    orderItem.quantity = quantity;
    orderItem.totalPrice = quantity * orderItem.unitPrice;
    cart.total = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);

    return await this.orderRepository.save(cart);
  }

  async getCart(user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: [
        { user: { id: user.id }, status: OrderStatus.CART },
        { user: { id: user.id }, status: OrderStatus.PENDING_PAYMENT }
      ],
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' }
    });

    if (!order) {
      throw new NotFoundException('No active cart or pending payment found');
    }

    // Enrich the order items with their product details
    for (const item of order.items) {
      if (item.itemType === OrderItemType.CANDLE) {
        const candle = await this.candleRepository.findOne({ where: { id: item.productId } });
        (item as any).productDetails = candle;
      } else {
        const extraProduct = await this.extraProductRepository.findOne({ where: { id: item.productId } });
        (item as any).productDetails = extraProduct;
      }
    }

    return order;
  }

  async getUserOrders(user: User): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: {
        user: { id: user.id },
        status: OrderStatus.PAID
      },
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' }
    });

    // Enrich all orders' items with their product details
    for (const order of orders) {
      for (const item of order.items) {
        if (item.itemType === OrderItemType.CANDLE) {
          const candle = await this.candleRepository.findOne({ where: { id: item.productId } });
          (item as any).productDetails = candle;
        } else {
          const extraProduct = await this.extraProductRepository.findOne({ where: { id: item.productId } });
          (item as any).productDetails = extraProduct;
        }
      }
    }

    return orders;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'user']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = status;
    if (status === OrderStatus.PAID) {
      order.paidAt = new Date();
    }

    return await this.orderRepository.save(order);
  }

  async setMercadoPagoPreferenceId(orderId: string, preferenceId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId } 
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.mercadoPagoPreferenceId = preferenceId;
    return await this.orderRepository.save(order);
  }

  async handleMercadoPagoWebhook(paymentId: string, status: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { mercadoPagoPaymentId: paymentId }
    });

    if (!order) {
      throw new NotFoundException(`Order with payment ID ${paymentId} not found`);
    }

    switch (status) {
      case 'approved':
        await this.updateOrderStatus(order.id, OrderStatus.PAID);
        break;
      case 'cancelled':
        await this.updateOrderStatus(order.id, OrderStatus.CANCELLED);
        break;
      default:
        // Handle other statuses as needed
        break;
    }
  }

  async createPaymentPreference(orderId: string): Promise<{ init_point: string }> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'user']
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Allow creating payment preference if order is in CART or PENDING_PAYMENT status
    if (order.status !== OrderStatus.CART && order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException('Order must be in cart or pending payment status');
    }

    // Load product details for each item
    for (const item of order.items) {
      if (item.itemType === OrderItemType.CANDLE) {
        const candle = await this.candleRepository.findOne({ where: { id: item.productId } });
        if (!candle) {
          throw new NotFoundException(`Candle with ID ${item.productId} not found`);
        }
        (item as any).productDetails = candle;
      } else {
        const extraProduct = await this.extraProductRepository.findOne({ where: { id: item.productId } });
        if (!extraProduct) {
          throw new NotFoundException(`Extra product with ID ${item.productId} not found`);
        }
        (item as any).productDetails = extraProduct;
      }
    }

    const preference = new Preference(this.mercadopago);
    const items = order.items.map(item => ({
      id: item.id,
      title: (item as any).productDetails.name,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      currency_id: "COP"
    }));

    const preferenceData = {
      items,
      back_urls: {
        success: `https://${process.env.BACKEND_URL}/orders/payment/success`,
        failure: `https://${process.env.BACKEND_URL}/orders/payment/failure`,
        pending: `https://${process.env.BACKEND_URL}/orders/payment/pending`
      },
      auto_return: "approved",
      notification_url: `https://${process.env.BACKEND_URL}/orders/webhook/mercadopago`,
      external_reference: order.id
    };
    console.log(preferenceData);

    const response = await preference.create({ body: preferenceData });
    
    // Update order status and save preference id
    order.status = OrderStatus.PENDING_PAYMENT;
    order.mercadoPagoPreferenceId = response.id;
    await this.orderRepository.save(order);

    return {
      init_point: response.init_point || ''
    };
  }
}