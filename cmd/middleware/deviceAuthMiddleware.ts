import { Request, Response, NextFunction, RequestHandler } from "express";
import { DeviceService } from "../../internal/service/deviceService";
import { AppError } from "../../internal/utils/appError";

export const verifyDevice = (deviceService: DeviceService): RequestHandler => {
  return async (req, res, next) => {
    try {
      const serialNumber = req.headers['device_serial'] as string;
      if (!serialNumber) {
        throw new AppError("Device serial number not provided.", 400);
      }

      const device = await deviceService.verifyDeviceBySerialNumber(serialNumber);
      if (!device) {
        throw new AppError("Invalid or inactive device serial number.", 403);
      }

      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: ` ${error}` });
      return;
    }
  };
};
