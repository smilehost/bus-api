// path: internal/controller/companyController.ts
import { Request, Response } from "express";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { company } from "@prisma/client";
import { CompanyService } from "./companyService";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.companyService.getAll();
      res
        .status(200)
        .json({ message: "Companies retrieved successfully", result });
    } catch (error) {
      ExceptionHandler.internalServerError(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const com_id = Util.parseId(req.params.com_id, "com_id");

      const result = await this.companyService.getById(com_id);
      res
        .status(200)
        .json({ message: "Company retrieved successfully", result });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ error: error.name, message: error.message });
        }else{
          ExceptionHandler.internalServerError(res, error);
        }
    }
  }


  async create(req: Request, res: Response) {
    try {
      const body = req.body as company;

      const result = await this.companyService.create(body);

      res.status(201).json({ message: "Company created successfully", result });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ error: error.name, message: error.message });
        }else{
          ExceptionHandler.internalServerError(res, error);
        }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { body, params } = Util.extractRequestContext<
        company,
        { com_id: number }
      >(req, {
        body: true,
        params: true,
      });

      const result = await this.companyService.update(params.com_id, body);

      res.status(200).json({ message: "Company updated successfully", result });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ error: error.name, message: error.message });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { params } = Util.extractRequestContext<void, { com_id: number }>(
        req,
        { params: true }
      );

      await this.companyService.delete(params.com_id);
      res.status(200).json({ message: "Company deleted successfully" });
    } catch (error) {
      if (error instanceof AppError) {
        res
          .status(error.statusCode)
          .json({ error: error.name, message: error.message });
        }else{
          ExceptionHandler.internalServerError(res, error);
        }
    }
  }
}
