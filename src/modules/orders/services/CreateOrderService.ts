import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

interface IProductPrice {
  product_id: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer not found.');

    const findProduct = await this.productsRepository.findAllById(products);

    if (findProduct.length === 0) throw new AppError('Product not found.');

    const productOrder = products.map<IProductPrice>(({ id, quantity }) => {
      const selectProduct = findProduct.find(product => product.id === id);

      if (selectProduct && quantity > selectProduct.quantity)
        throw new AppError(
          `Insufficient quantity for the product ${selectProduct.name}.`,
        );

      return {
        product_id: id,
        quantity,
        price: selectProduct?.price || 0,
      };
    });

    const order = await this.ordersRepository.create({
      customer,
      products: [...productOrder],
    });

    await this.productsRepository.updateQuantity(products);

    return order;
  }
}

export default CreateProductService;
