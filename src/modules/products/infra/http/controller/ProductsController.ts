import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, price, quantity } = req.body;
    const createProductService = container.resolve(CreateProductService);

    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return res.json(product);
  }
}
