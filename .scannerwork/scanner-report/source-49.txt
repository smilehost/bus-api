import { LocationController } from "../../internal/controller/locationController";
import { LocationService } from "../../internal/service/locationService";
import { Request, Response } from "express";
import { Util } from "../../internal/utils/util";
import { AppError } from "../../internal/utils/appError";

jest.mock("../../internal/service/locationService");
jest.mock("../../internal/utils/util.ts");

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

  // --- getAll ---
  const getAll_cases = [
    {
      name: "should return all route locations",
      serviceResult: [
        {
          route_location_id: 4,
          route_location_name: "จุดจอดหน้าโรงเรียน",
          route_location_lat: "13.7563",
          route_location_long: "100.5018",
          route_location_com_id: 1,
        },
        {
          route_location_id: 3,
          route_location_name: "เซนทรัลพลาซ่า",
          route_location_lat: "16.432604",
          route_location_long: "102.825183",
          route_location_com_id: 1,
        },
      ],
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (result: any) => ({
        message: "Route locations retrieved successfully",
        result,
      }),
    },
    {
      name: "should return AppError (400) on bad request",
      serviceResult: null,
      serviceError: AppError.BadRequest("Invalid request"),
      expectedStatus: 400,
      expectedJson: {
        error: "Bad Request",
        message: "Invalid request",
      },
    },
  ];

  // --- getByPagination ---
  const getByPagination_cases = [
    {
      name: "should return paginated route locations",
      serviceResult: {
        page: 1,
        size: 5,
        total: 2,
        totalPages: 1,
        data: [
          {
            route_location_id: 4,
            route_location_name: "จุดจอดหน้าโรงเรียน",
            route_location_lat: "13.7563",
            route_location_long: "100.5018",
            route_location_com_id: 1,
          },
          {
            route_location_id: 3,
            route_location_name: "เซนทรัลพลาซ่า",
            route_location_lat: "16.432604",
            route_location_long: "102.825183",
            route_location_com_id: 1,
          },
        ],
      },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (result: any) => ({
        message: "Route locations retrieved successfully",
        result,
      }),
    },
    {
      name: "should return AppError (400) on invalid pagination params",
      serviceResult: null,
      serviceError: AppError.BadRequest("Invalid pagination parameters"),
      expectedStatus: 400,
      expectedJson: {
        error: "Bad Request",
        message: "Invalid pagination parameters",
      },
    },
    {
      name: "should return 500 on internal server error",
      serviceResult: null,
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
      name: "should return a route location by ID",
      serviceResult: {
        route_location_id: 4,
        route_location_name: "จุดจอดหน้าโรงเรียน",
        route_location_lat: "13.7563",
        route_location_long: "100.5018",
        route_location_com_id: 1,
      },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (result: any) => ({
        message: "Route location retrieved successfully",
        result,
      }),
    },
    {
      name: "should return AppError (404) when not found",
      serviceResult: null,
      serviceError: AppError.NotFound("Route location not found"),
      expectedStatus: 404,
      expectedJson: {
        error: "Not Found",
        message: "Route location not found",
      },
    },
  ];

  // --- create ---
  const create_cases = [
    {
      name: "should create a route location",
      serviceResult: {
        route_location_id: 5,
        route_location_name: "จุดจอดหน้าโรงเรียน",
        route_location_lat: "13.7563",
        route_location_long: "100.5018",
        route_location_com_id: 1,
      },
      serviceError: null,
      expectedStatus: 201,
      expectedJson: (result: any) => ({
        message: "Route location created successfully",
        result,
      }),
    },
    {
      name: "should return AppError (400) on invalid input data",
      serviceResult: null,
      serviceError: AppError.BadRequest("Invalid input"),
      expectedStatus: 400,
      expectedJson: {
        error: "Bad Request",
        message: "Invalid input",
      },
    },
    {
      name: "should return 500 on internal server error",
      serviceResult: null,
      serviceError: new Error("Unexpected error"),
      expectedStatus: 500,
      expectedJson: {
        error: "Internal Server Error",
        message: "Unexpected error",
      },
    },
  ];

  // --- update ---
  const update_cases = [
    {
      name: "should update a route location",
      serviceResult: {
        route_location_id: 5,
        route_location_name: "จุดจอดหน้าโรงเรียน 2",
        route_location_lat: "13.7563",
        route_location_long: "100.5018",
        route_location_com_id: 1,
      },
      serviceError: null,
      expectedStatus: 200,
      expectedJson: (result: any) => ({
        message: "Route location updated successfully",
        result,
      }),
    },
    {
      name: "should return AppError (404) when updating non-existent route location",
      serviceResult: null,
      serviceError: AppError.NotFound("Route location not found"),
      expectedStatus: 404,
      expectedJson: {
        error: "Not Found",
        message: "Route location not found",
      },
    },
    {
      name: "should return 500 on internal server error",
      serviceResult: null,
      serviceError: new Error("Unexpected error"),
      expectedStatus: 500,
      expectedJson: {
        error: "Internal Server Error",
        message: "Unexpected error",
      },
    },
  ];

  // --- delete ---
  const delete_cases = [
    {
      name: "should delete a route location",
      serviceError: null,
      expectedStatus: 200,
      expectedJson: {
        message: "Route location deleted successfully",
      },
    },
    {
      name: "should return AppError (404) when deleting non-existent route location",
      serviceError: AppError.NotFound("Route location not found"),
      expectedStatus: 404,
      expectedJson: {
        error: "Not Found",
        message: "Route location not found",
      },
    },
    {
      name: "should return 500 on internal server error",
      serviceError: new Error("Unexpected error"),
      expectedStatus: 500,
      expectedJson: {
        error: "Internal Server Error",
        message: "Unexpected error",
      },
    },
  ];

  // ===============================
  // Test Cases
  // ===============================

  describe("getAll()", () => {
    getAll_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
        });

        if (testCase.serviceError) {
          (mockService.getAll as jest.Mock).mockRejectedValue(
            testCase.serviceError
          );
        } else {
          (mockService.getAll as jest.Mock).mockResolvedValue(
            testCase.serviceResult
          );
        }

        await controller.getAll(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(testCase.expectedStatus);
        expect(jsonMock).toHaveBeenCalledWith(
          typeof testCase.expectedJson === "function"
            ? testCase.expectedJson(testCase.serviceResult)
            : testCase.expectedJson
        );
      });
    });
  });

  describe("getByPagination()", () => {
    getByPagination_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.extractRequestContext as jest.Mock).mockReturnValue({
          com_id: 1,
          query: { page: 1, size: 5, search: "" },
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
          params: { route_location_id: 4 },
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
          body: {
            route_location_name: "จุดจอดหน้าโรงเรียน",
            route_location_lat: "13.7563",
            route_location_long: "100.5018",
            route_location_com_id: 1,
          },
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
          body: {
            route_location_name: "จุดจอดหน้าโรงเรียน 2",
            route_location_lat: "13.7563",
            route_location_long: "100.5018",
            route_location_com_id: 1,
          },
          params: { route_location_id: 5 },
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
          params: { route_location_id: 5 },
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
