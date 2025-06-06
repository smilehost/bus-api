import { RouteController } from "../../internal/controller/routeController";
import { RouteService } from "../../internal/domain/route/routeService";
import { Request, Response } from "express";
import { Util } from "../../internal/utils/util";
import { AppError } from "../../internal/utils//appError";

jest.mock("../../internal/service/routeService");
jest.mock("../../internal/utils/util.ts");

describe("RouteController", () => {
  let controller: RouteController;
  let mockService: jest.Mocked<RouteService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const mockRouteRepository = {} as any;
    const mockDateRepository = {} as any;
    const mockTimeRepository = {} as any;

    mockService = new RouteService(
      mockRouteRepository,
      mockDateRepository,
      mockTimeRepository
    ) as jest.Mocked<RouteService>;
    controller = new RouteController(mockService);

    req = {};
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  // --- getByPagination ---
  const getByPagination_cases = [
    {
      name: "should return paginated routes",
      serviceResult: { page: 1, size: 5, total: 2, totalPages: 1, data: [{}] },
      query: { page: 1, size: 5, search: "test" },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (result: any) => ({
        message: "Routes retrieved successfully",
        result,
      }),
    },
    {
      name: "should return AppError (400) on bad query",
      serviceResult: null,
      query: { page: 0, size: 0, search: "" },
      serviceError: AppError.BadRequest("Invalid query"),
      expectedStatus: 400,
      expectedJson: {
        error: "Bad Request",
        message: "Invalid query",
      },
    },
    {
      name: "should handle unknown error",
      serviceResult: null,
      query: { page: 1, size: 5, search: "" },
      serviceError: new Error("Unexpected error"),
      expectedStatus: 500,
      expectedJson: {
        error: "Internal Server Error",
        message: "Unexpected error",
      },
    },
  ];

  // --- getById ---
  const getById_cases = [
    {
      name: "should return a route by ID",
      serviceResult: { id: 1, name: "Route A" },
      params: { route_id: 1 },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (route: any) => ({
        message: "Route retrieved successfully",
        result: route,
      }),
    },
    {
      name: "should return AppError (404) when route not found",
      serviceResult: null,
      params: { route_id: 999 },
      serviceError: AppError.NotFound("Route not found"),
      expectedStatus: 404,
      expectedJson: {
        error: "Not Found",
        message: "Route not found",
      },
    },
  ];

  // --- create ---
  const create_cases = [
    {
      name: "should create a new route",
      body: { name: "New Route" },
      serviceResult: { id: 1, name: "New Route" },
      serviceError: null,
      expectedStatus: 201,
      expectedJson: (route: any) => ({
        message: "Route created successfully",
        result: route,
      }),
    },
    {
      name: "should return AppError (400) when invalid body",
      body: {},
      serviceResult: null,
      serviceError: AppError.BadRequest("Invalid data"),
      expectedStatus: 400,
      expectedJson: {
        error: "Bad Request",
        message: "Invalid data",
      },
    },
  ];

  // --- update ---
  const update_cases = [
    {
      name: "should update an existing route",
      body: { name: "Updated Route" },
      params: { route_id: 1 },
      serviceResult: { id: 1, name: "Updated Route" },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (route: any) => ({
        message: "Route updated successfully",
        result: route,
      }),
    },
    {
      name: "should return AppError (404) when route not found",
      body: { name: "Updated Route" },
      params: { route_id: 999 },
      serviceResult: null,
      serviceError: AppError.NotFound("Route not found"),
      expectedStatus: 404,
      expectedJson: {
        error: "Not Found",
        message: "Route not found",
      },
    },
  ];

  // --- delete ---
  const delete_cases = [
    {
      name: "should delete a route",
      params: { route_id: 1 },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: {
        message: "Route deleted successfully",
      },
    },
    {
      name: "should return AppError (404) when route not found",
      params: { route_id: 999 },
      serviceError: AppError.NotFound("Route not found"),
      expectedStatus: 404,
      expectedJson: {
        error: "Not Found",
        message: "Route not found",
      },
    },
  ];

  // ===============================
  // Test Cases
  // ===============================

  describe("getByPagination()", () => {
    getByPagination_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          query: testCase.query,
        });

        if (testCase.serviceError) {
          (mockService.getByPagination as jest.Mock).mockRejectedValue(
            testCase.serviceError
          );
        } else {
          (mockService.getByPagination as jest.Mock).mockResolvedValue(
            testCase.serviceResult
          );
        }

        await controller.getByPagination(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(testCase.expectedStatus);
        expect(jsonMock).toHaveBeenCalledWith(
          typeof testCase.expectedJson === "function"
            ? testCase.expectedJson(testCase.serviceResult)
            : testCase.expectedJson
        );
      });
    });
  });

  describe("getById()", () => {
    getById_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          params: testCase.params,
        });

        if (testCase.serviceError) {
          (mockService.getById as jest.Mock).mockRejectedValue(
            testCase.serviceError
          );
        } else {
          (mockService.getById as jest.Mock).mockResolvedValue(
            testCase.serviceResult
          );
        }

        await controller.getById(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(testCase.expectedStatus);
        expect(jsonMock).toHaveBeenCalledWith(
          typeof testCase.expectedJson === "function"
            ? testCase.expectedJson(testCase.serviceResult)
            : testCase.expectedJson
        );
      });
    });
  });

  describe("create()", () => {
    create_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          body: testCase.body,
        });

        if (testCase.serviceError) {
          (mockService.create as jest.Mock).mockRejectedValue(
            testCase.serviceError
          );
        } else {
          (mockService.create as jest.Mock).mockResolvedValue(
            testCase.serviceResult
          );
        }

        await controller.create(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(testCase.expectedStatus);
        expect(jsonMock).toHaveBeenCalledWith(
          typeof testCase.expectedJson === "function"
            ? testCase.expectedJson(testCase.serviceResult)
            : testCase.expectedJson
        );
      });
    });
  });

  describe("update()", () => {
    update_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          body: testCase.body,
          params: testCase.params,
        });

        if (testCase.serviceError) {
          (mockService.update as jest.Mock).mockRejectedValue(
            testCase.serviceError
          );
        } else {
          (mockService.update as jest.Mock).mockResolvedValue(
            testCase.serviceResult
          );
        }

        await controller.update(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(testCase.expectedStatus);
        expect(jsonMock).toHaveBeenCalledWith(
          typeof testCase.expectedJson === "function"
            ? testCase.expectedJson(testCase.serviceResult)
            : testCase.expectedJson
        );
      });
    });
  });

  describe("delete()", () => {
    delete_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          params: testCase.params,
        });

        if (testCase.serviceError) {
          (mockService.delete as jest.Mock).mockRejectedValue(
            testCase.serviceError
          );
        } else {
          (mockService.delete as jest.Mock).mockResolvedValue(undefined);
        }

        await controller.delete(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(testCase.expectedStatus);
        expect(jsonMock).toHaveBeenCalledWith(testCase.expectedJson);
      });
    });
  });
});
