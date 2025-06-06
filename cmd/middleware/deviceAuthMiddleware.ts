import { Request, Response, NextFunction, RequestHandler } from "express";
import { DeviceService } from "../../internal/domain/company/device/deviceService";
import { AppError } from "../../internal/utils/appError";

export const verifyDevice = (deviceService: DeviceService): RequestHandler => {
  return async (req, res, next) => {
    try {
      const serialNumber = req.headers['device_serial'] as string;
      if (!serialNumber) {
        throw new AppError("Device serial number not provided.", 400);
      }

      const device = await deviceService.verifyDeviceBySerialNumber((req as any).user.com_id,serialNumber);

      console.log((req as any).user,"xxxxxxxxxx")
      console.log(!device!.device_com_id !== (req as any).user.com_id)
      console.log(!device)

      if (!device) {
        throw new AppError("Invalid or inactive device serial number.", 403);
      }

      (req as any).device = device;

      next();
    } catch (error) {
      console.log(error);
      res.status(403).json({ message: ` ${error}` });
      return;
    }
  };
};
