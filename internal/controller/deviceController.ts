import { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { DeviceService } from "../service/deviceService";
import { ExceptionHandler } from "../utils/exception";
import { Util } from "../utils/util";
import { device } from "@prisma/client"; 

export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  async getByPagination(req: Request, res: Response): Promise<void> {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string; status?: number; com_id:number } 
      >(req, {
        query: true,
      });

      const result = await this.deviceService.getByPagination(
        query.com_id,
        query.page,
        query.size,
        query.search,
        query.status
      );
      
      res.status(200).json({
        message: "Devices retrieved successfully",
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

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { com_id, body } = Util.extractRequestContext<{
        device_serial_number:string
      }>(req, {
        body: true,
      });

      const result = await this.deviceService.create(
        com_id,
        body.device_serial_number
      );

      res.status(200).json({ 
        message: "Device updated successfully", 
        result 
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

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { device_id: number }
      >(req, {
        params: true,
      });

      const result = await this.deviceService.getById(com_id, params.device_id);
      
      res.status(200).json({
        message: "Device retrieved successfully",
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

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { com_id, body, params } = Util.extractRequestContext<
        Partial<device>, // Use Partial<device> as not all fields might be updatable
        { device_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.deviceService.update(
        com_id,
        params.device_id,
        body
      );

      res.status(200).json({ 
        message: "Device updated successfully", 
        result 
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

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { com_id, params } = Util.extractRequestContext<
        void,
        { device_id: number }
      >(req, {
        params: true,
      });

      await this.deviceService.delete(com_id, params.device_id);

      res.status(200).json({ 
        message: "Device deleted successfully" 
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

  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { com_id, params, body } = Util.extractRequestContext<
        { status: number }, // Only status is expected in the body
        { device_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.deviceService.changeStatus(
        com_id,
        params.device_id,
        body.status
      );
        
      res.status(200).json({ 
        message: "Device status updated successfully", 
        result 
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
