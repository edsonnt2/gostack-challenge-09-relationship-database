import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const findOrderService = container.resolve(FindOrderService);

    const order = await findOrderService.execute({
      id: req.params.id,
    });

    return res.json(order);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { customer_id, products } = req.body;
    const createOrderService = container.resolve(CreateOrderService);

    const order = await createOrderService.execute({
      customer_id,
      products,
    });

    return res.json(order);
  }
}
