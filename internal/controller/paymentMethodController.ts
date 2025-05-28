import { Request, Response } from "express";
import { PaymentMethodService } from "../service/paymentMethodService";
import { Util } from "../utils/util";
import { ExceptionHandler } from "../utils/exception";
import { AppError } from "../utils/appError";
import { payment_method } from "@prisma/client";

export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  async createPaymentMethod(req: Request, res: Response) {
    try {
      const { com_id,body } = Util.extractRequestContext<
        Omit<payment_method, 'payment_method_id'>
      >(req, {body: true,});

      const result = await this.paymentMethodService.createPaymentMethod(com_id,body);

      res.status(201).json({
        message: "Payment method created successfully",
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

  async getAllPaymentMethods(req: Request, res: Response) {
    try {
      const { com_id } = Util.extractRequestContext(req);
      const result = await this.paymentMethodService.getAllPaymentMethods(com_id);
      const data = result.map(({ payment_method_url, ...rest }) => rest)
      res.status(200).json({
        message: "Payment methods retrieved successfully",
        result:data,
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

  async getPaymentMethodById(req: Request, res: Response) {
    try {
      const { com_id,params } = Util.extractRequestContext<
        void,
        { payment_method_id: number }
      >(req, {params: true,});

      const result = await this.paymentMethodService.getPaymentMethodById(
        params.payment_method_id
      );

      res.status(200).json({
        message: "Payment method retrieved successfully",
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

  async updatePaymentMethod(req: Request, res: Response) {
    try {
      const { params, body } = Util.extractRequestContext<
        Partial<Omit<payment_method, 'payment_method_id'>>,
        { payment_method_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.paymentMethodService.updatePaymentMethod(
        params.payment_method_id,
        body
      );

      res.status(200).json({
        message: "Payment method updated successfully",
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

  async deletePaymentMethod(req: Request, res: Response) {
    try {
      const { params } = Util.extractRequestContext<
        void,
        { payment_method_id: number }
      >(req, {
        params: true,
      });

      await this.paymentMethodService.deletePaymentMethod(
        params.payment_method_id
      );

      res.status(200).json({
        message: "Payment method deleted successfully",
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

  async changeStatus(req: Request, res: Response) {
    try {
      const { params, body } = Util.extractRequestContext<
        { status: number },
        { payment_method_id: number }
      >(req, {params: true,body: true,});

      let result;
      if (body.status === 1) {
        result = await this.paymentMethodService.activatePaymentMethod(
          params.payment_method_id
        );
      } else {
        result = await this.paymentMethodService.deactivatePaymentMethod(
          params.payment_method_id
        );
      }

      const statusMessage = body.status === 1 ? "activated" : "deactivated";
      res.status(200).json({
        message: `Payment method ${statusMessage} successfully`,
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

}
