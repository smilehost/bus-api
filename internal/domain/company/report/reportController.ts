import { Request, Response } from "express";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { ReportService } from "./reportService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  async getReport(req: Request, res: Response) {
    try {
      const { com_id, params, body } = Util.extractRequestContext<
        { date: string },
        { choice: number }
      >(req, {
        params: true,
        body: true,
      });
      console.log("-----------1");
      

      const result = await this.reportService.getPaymentReport(com_id, params.choice, body.date);

      res.status(200).json({
        message: "Transaction created successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }
      ExceptionHandler.internalServerError(res, error);
    }
  }
}