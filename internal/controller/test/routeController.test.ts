import { Request, Response } from "express";
import { RouteController } from "../routeController";
import { RouteService } from "../../service/routeService";
import { AppError } from "../../utils/appError";
import { Util } from "../../utils/util";

// mock Util.extractRequestContext
jest.mock("../../utils/util", () => ({
  Util: {
    extractRequestContext: jest.fn(),
  },
}));

describe("RouteController", () => {
  let mockRouteService: Partial<RouteService>;
  let controller: RouteController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRouteService = {
      create: jest.fn(),
      // เตรียมไว้สำหรับเมธอดอื่นในอนาคต เช่น update, delete, find
    };

    controller = new RouteController(mockRouteService as RouteService);

    req = {
      headers: { com_id: "1" },
      body: {
        route_name_th: "เส้นทางหลักในกรุงเทพฯ",
        route_name_en: "Main Route Bangkok",
        route_color: "#FF5733",
        route_status: 1,
        route_com_id: 1,
        date_id: 1,
        time_id: 7,
        route_array: "1,2,3,1,2",
      },
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };

    (Util.extractRequestContext as jest.Mock).mockReturnValue({
      com_id: 1,
      body: req.body,
    });
  });

  describe("create()", () => {
    it("should return 201 if route is created successfully", async () => {
      (mockRouteService.create as jest.Mock).mockResolvedValue({
        route_id: 123,
        ...req.body,
        route_com_id: 1,
      });

      await controller.create(req as Request, res as Response);

      expect(Util.extractRequestContext).toHaveBeenCalledWith(req, {
        body: true,
      });
      expect(mockRouteService.create).toHaveBeenCalledWith(1, req.body);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Route created successfully",
        result: {
          route_id: 123,
          ...req.body,
          route_com_id: 1,
        },
      });
    });

    it("should return AppError response if error is AppError", async () => {
      const appError = AppError.BadRequest("Invalid route data");
      (mockRouteService.create as jest.Mock).mockRejectedValue(appError);

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Bad Request",
        message: "Invalid route data",
      });
    });

    it("should return 500 if unknown error occurs", async () => {
      const genericError = new Error("Unexpected");
      (mockRouteService.create as jest.Mock).mockRejectedValue(genericError);

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await controller.create(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Internal Server Error",
        message: "Unexpected",
      });

      consoleSpy.mockRestore();
    });
  });

  // ✅ ตัวอย่างโครงสำหรับเมธอดอื่นในอนาคต
  describe("update()", () => {
    it.todo("should update a route and return 200");
  });

  describe("delete()", () => {
    it.todo("should delete a route and return 204");
  });

  describe("findById()", () => {
    it.todo("should return route if found");
    it.todo("should return 404 if route not found");
  });
});
