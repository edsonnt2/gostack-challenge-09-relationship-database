import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('integer')
  quantity: number;

  @Column('uuid')
  product_id: string;

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('uuid')
  order_id: string;

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
