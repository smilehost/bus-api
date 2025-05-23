// path: internal/controller/discountController.ts
import { Request, Response } from "express";
import { DiscountService } from "../service/discountService";
import { AppError } from "../utils/appError";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { ticket_discount } from "@prisma/client";
import { createDiscountDto } from "../../cmd/dto";

export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  async getAll(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);
      const result = await this.discountService.getAll(com_id);

      res.status(200).json({
        message: "Discounts retrieved successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { ticket_discount_id: number }
      >(req, { params: true});

      const result = await this.discountService.getById(
        com_id,
        params.ticket_discount_id
      );

      res.status(200).json({
        message: "Discount retrieved successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<createDiscountDto>(
        req,{body: true,}
        );

      const result = await this.discountService.create(com_id, body);

      res.status(201).json({
        message: "Discount created successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        ticket_discount,
        { ticket_discount_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.discountService.update(
        com_id,
        params.ticket_discount_id,
        body
      );

      res.status(200).json({
        message: "Discount updated successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { ticket_discount_id: number }
      >(req, {params: true,});

      await this.discountService.deleteById(com_id, params.ticket_discount_id);

      res.status(200).json({
        message: "Discount deleted successfully",
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }
}
