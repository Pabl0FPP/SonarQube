import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

export enum OrderItemType {
  CANDLE = 'candle',
  EXTRA_PRODUCT = 'extra_product'
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column('uuid')
  productId: string;

  @Column({
    type: 'enum',
    enum: OrderItemType
  })
  itemType: OrderItemType;

  @Column()
  quantity: number;

  @Column('int')
  unitPrice: number;

  @Column('int')
  totalPrice: number;
} 