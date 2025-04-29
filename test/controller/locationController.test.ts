import { LocationController } from "../../internal/controller/locationController";
import { LocationService } from "../../internal/service/locationService";
import { Util } from "../../internal/utils/util";
import { AppError } from "../../internal/utils/appError";
import { Request, Response } from "express";

jest.mock("../../internal/service/locationService");
jest.mock("../../internal/utils/util");

describe("LocationController", () => {
  let controller: LocationController;
  let mockService: jest.Mocked<LocationService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const mockLocationRepository = {} as any;
    const mockCompanyRepository = {} as any;
    mockService = new LocationService(
      mockLocationRepository,
      mockCompanyRepository
    ) as jest.Mocked<LocationService>;
    controller = new LocationController(mockService);

    req = {};
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  const testCases = [
    {
      method: "getAll",
      setup: () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({ com_id: 1 });
        mockService.getAll.mockResolvedValue([{ id: 1, name: "Loc A" }]);
      },
      expectedStatus: 200,
      expectedJson: {
        message: "Route locations retrieved successfully",
        result: [{ id: 1, name: "Loc A" }],
      },
    },
    {
      method: "getByPagination",
      setup: () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          query: { page: 1, size: 10, search: "" },
        });
        mockService.getByPagination.mockResolvedValue({ page: 1, size: 10, total: 1, data: [{}] });
      },
      expectedStatus: 200,
      expectedJson: {
        message: "Route locations retrieved successfully",
        result: { page: 1, size: 10, total: 1, data: [{}] },
      },
    },
    {
      method: "getById",
      setup: () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          params: { route_location_id: 1 },
        });
        mockService.getById.mockResolvedValue({ id: 1, name: "Loc A" });
      },
      expectedStatus: 200,
      expectedJson: {
        message: "Route location retrieved successfully",
        result: { id: 1, name: "Loc A" },
      },
    },
    {
      method: "create",
      setup: () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          body: { name: "New Location" },
        });
        mockService.create.mockResolvedValue({ id: 2, name: "New Location" });
      },
      expectedStatus: 201,
      expectedJson: {
        message: "Route location created successfully",
        result: { id: 2, name: "New Location" },
      },
    },
    {
      method: "update",
      setup: () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          body: { name: "Updated" },
          params: { route_location_id: 1 },
        });
        mockService.update.mockResolvedValue({ id: 1, name: "Updated" });
      },
      expectedStatus: 200,
      expectedJson: {
        message: "Route location updated successfully",
        result: { id: 1, name: "Updated" },
      },
    },
    {
      method: "delete",
      setup: () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          params: { route_location_id: 1 },
        });
        mockService.delete.mockResolvedValue(undefined);
      },
      expectedStatus: 200,
      expectedJson: {
        message: "Route location deleted successfully",
      },
    },
  ];

  testCases.forEach(({ method, setup, expectedStatus, expectedJson }) => {
    it(`${method}() should respond with ${expectedStatus}`, async () => {
      setup();
      await (controller[method] as any)(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(expectedStatus);
      expect(jsonMock).toHaveBeenCalledWith(expectedJson);
    });
  });

  it("should return AppError response", async () => {
    (Util.extractRequestContext as jest.Mock).mockReturnValue({ com_id: 1 });
    const appError = AppError.BadRequest("Invalid request");
    mockService.getAll.mockRejectedValue(appError);

    await controller.getAll(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Bad Request",
      message: "Invalid request",
    });
  });

  it("should handle unexpected error", async () => {
    (Util.extractRequestContext as jest.Mock).mockReturnValue({ com_id: 1 });
    mockService.getAll.mockRejectedValue(new Error("Unknown error"));

    const spy = jest.spyOn(require("../../internal/utils/exception").ExceptionHandler, "internalServerError");

    await controller.getAll(req as Request, res as Response);
    expect(spy).toHaveBeenCalled();
  });
});