import { RouteController } from "../../internal/controller/routeController";
import { RouteService } from "../../internal/service/routeService";
import { Request, Response } from "express";
import { Util } from "../../internal/utils/util";
import { AppError } from "../../internal/utils//appError";

jest.mock("../../utils/util", () => ({
  Util: {
    extractRequestContext: jest.fn(),
  },
}));

describe("RouteController", () => {
  let controller: RouteController;
  let mockRouteService: Partial<RouteService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = { status: statusMock, json: jsonMock };

    req = {};

    mockRouteService = {
      getByPagination: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new RouteController(mockRouteService as RouteService);
  });

  describe("getByPagination()", () => {
    it("should return paginated routes with search", async () => {
      const query = { page: 1, size: 5, search: "Ma" };
      const result = {
        page: 1,
        size: 5,
        total: 2,
        totalPages: 1,
        data: [{ route_id: 1 }],
      };
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        query,
      });
      (mockRouteService.getByPagination as jest.Mock).mockResolvedValue(result);

      await controller.getByPagination(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Routes retrieved successfully",
        result,
      });
    });

    it("should return routes without search (empty string)", async () => {
      const query = { page: 1, size: 5, search: "" };
      const result = {
        page: 1,
        size: 5,
        total: 1,
        totalPages: 1,
        data: [{ route_id: 1 }],
      };
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        query,
      });
      (mockRouteService.getByPagination as jest.Mock).mockResolvedValue(result);

      await controller.getByPagination(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        message: "Routes retrieved successfully",
        result,
      });
    });

    it("should return AppError correctly", async () => {
      const error = AppError.BadRequest("Invalid query");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        query: { page: 1, size: 5, search: "" },
      });
      (mockRouteService.getByPagination as jest.Mock).mockRejectedValue(error);

      await controller.getByPagination(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Bad Request",
        message: "Invalid query",
      });
    });

    it("should return 500 if unknown error occurs", async () => {
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        query: { page: 1, size: 5, search: "" },
      });
      (mockRouteService.getByPagination as jest.Mock).mockRejectedValue(
        new Error("Unexpected")
      );

      await controller.getByPagination(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
        message: "Unexpected",
      });
    });
  });

  describe("getById()", () => {
    it("should return a route if found", async () => {
      const mockRoute = {
        route_id: 29,
        route_com_id: 1,
        route_name_th: "เส้นทาง",
      };
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        params: { route_id: 29 },
      });
      (mockRouteService.getById as jest.Mock).mockResolvedValue(mockRoute);

      await controller.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Route retrieved successfully",
        result: mockRoute,
      });
    });

    it("should return 404 if route not found", async () => {
      const error = AppError.NotFound("Route not found");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        params: { route_id: 999 },
      });
      (mockRouteService.getById as jest.Mock).mockRejectedValue(error);

      await controller.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Not Found",
        message: "Route not found",
      });
    });

    it("should return 403 if company ID does not match", async () => {
      const error = AppError.Forbidden("Company ID mismatch");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 2,
        params: { route_id: 29 },
      });
      (mockRouteService.getById as jest.Mock).mockRejectedValue(error);

      await controller.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Forbidden",
        message: "Company ID mismatch",
      });
    });

    it("should return 500 if unknown error occurs", async () => {
      const error = new Error("Unexpected failure");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        params: { route_id: 29 },
      });
      (mockRouteService.getById as jest.Mock).mockRejectedValue(error);

      await controller.getById(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
        message: "Unexpected failure",
      });
    });
  });

  describe("create()", () => {
    const body = { route_name_th: "ใหม่", route_com_id: 1 };

    it("should create a new route", async () => {
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        body,
      });
      (mockRouteService.create as jest.Mock).mockResolvedValue({
        route_id: 30,
        ...body,
      });

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Route created successfully",
        result: { route_id: 30, ...body },
      });
    });

    it("should return 403 if company mismatched", async () => {
      const error = AppError.Forbidden("Company ID mismatch");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 2,
        body,
      });
      (mockRouteService.create as jest.Mock).mockRejectedValue(error);

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Forbidden",
        message: "Company ID mismatch",
      });
    });

    it("should return 404 if date or time not found", async () => {
      const error = AppError.NotFound("Date not found");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        body,
      });
      (mockRouteService.create as jest.Mock).mockRejectedValue(error);

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Not Found",
        message: "Date not found",
      });
    });

    it("should return 500 on unknown error", async () => {
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        body,
      });
      (mockRouteService.create as jest.Mock).mockRejectedValue(
        new Error("Unexpected")
      );

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
        message: "Unexpected",
      });
    });
  });

  describe("update()", () => {
    const routeId = 28;
    const body = { route_name_th: "อัปเดต", route_com_id: 1 };

    it("should update route", async () => {
      const updated = { route_id: routeId, ...body };
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        body,
        params: { route_id: routeId },
      });
      (mockRouteService.update as jest.Mock).mockResolvedValue(updated);

      await controller.update(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Route updated successfully",
        result: updated,
      });
    });

    it("should return 404 if route not found", async () => {
      const error = AppError.NotFound("Route not found");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        body,
        params: { route_id: routeId },
      });
      (mockRouteService.update as jest.Mock).mockRejectedValue(error);

      await controller.update(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Not Found",
        message: "Route not found",
      });
    });

    it("should return 403 if company mismatch", async () => {
      const error = AppError.Forbidden("Forbidden update");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 2,
        body,
        params: { route_id: routeId },
      });
      (mockRouteService.update as jest.Mock).mockRejectedValue(error);

      await controller.update(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Forbidden",
        message: "Forbidden update",
      });
    });

    it("should return 500 on unknown error", async () => {
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        body,
        params: { route_id: routeId },
      });
      (mockRouteService.update as jest.Mock).mockRejectedValue(
        new Error("Unexpected")
      );

      await controller.update(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
        message: "Unexpected",
      });
    });
  });

  describe("delete()", () => {
    const routeId = 28;

    it("should delete route", async () => {
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        params: { route_id: routeId },
      });
      (mockRouteService.delete as jest.Mock).mockResolvedValue(undefined);

      await controller.delete(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Route deleted successfully",
      });
    });

    it("should return 404 if route not found", async () => {
      const error = AppError.NotFound("Route not found");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        params: { route_id: routeId },
      });
      (mockRouteService.delete as jest.Mock).mockRejectedValue(error);

      await controller.delete(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Not Found",
        message: "Route not found",
      });
    });

    it("should return 403 if forbidden", async () => {
      const error = AppError.Forbidden("Cannot delete");
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 2,
        params: { route_id: routeId },
      });
      (mockRouteService.delete as jest.Mock).mockRejectedValue(error);

      await controller.delete(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Forbidden",
        message: "Cannot delete",
      });
    });

    it("should return 500 on unknown error", async () => {
      (Util.extractRequestContext as jest.Mock).mockReturnValue({
        com_id: 1,
        params: { route_id: routeId },
      });
      (mockRouteService.delete as jest.Mock).mockRejectedValue(
        new Error("Unexpected")
      );

      await controller.delete(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
        message: "Unexpected",
      });
    });
  });
});
