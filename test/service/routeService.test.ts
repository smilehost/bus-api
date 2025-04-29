import { Route } from "../../cmd/models";
import { RouteService } from "../../internal/service/routeService";
import { AppError } from "../../internal/utils/appError";
import { Util } from "../../internal/utils/util";

const mockRouteRepository = {
  getPaginated: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockDateRepository = {
  getById: jest.fn(),
};

const mockTimeRepository = {
  getById: jest.fn(),
};

jest.mock("../../internal/utils/util");

const routeService = new RouteService(
  mockRouteRepository as any,
  mockDateRepository as any,
  mockTimeRepository as any
);

describe("RouteService Tests", () => {

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });



  const getByPagination_cases = [
    {
      name: "should return paginated routes",
      input: { comId: 1, page: 1, size: 5, search: "" },
      mockPaginatedResult: {
        page: 1,
        size: 5,
        total: 10,
        data: [],
        totalPages: 2,
      },
      expectedError: null,
    },
    {
      name: "should throw AppError on (intermediate value) is not iterable",
      input: { comId: 1, page: -1, size: 5, search: "" },
      mockPaginatedResult: null,
      expectedError: AppError.BadRequest(
        "(intermediate value) is not iterable"
      ),
    },
    {
      name: "should return correct pagination structure with results",
      input: { comId: 1, page: 2, size: 5, search: "test" },
      mockPaginatedResult: {
        data: [
          { id: 101, name: "Route X" },
          { id: 102, name: "Route Y" },
        ],
        page: 2,
        size: 5,
        total: 12,
        totalPages: 3,
      },
      expectedOutput: {
        page: 2,
        size: 5,
        total: 12,
        totalPages: 3,
        data: [
          { id: 101, name: "Route X" },
          { id: 102, name: "Route Y" },
        ],
      },
      expectedError: null,
    },
  ];

  const getById_cases = [
    {
      name: "should return route by ID",
      input: { comId: 1, routeId: 1 },
      mockRoute: { route_com_id: 1 },
      expected: { route_com_id: 1 },
      expectedError: null,
    },
    {
      name: "should throw NotFound if route not found",
      input: { comId: 1, routeId: 999 },
      mockRoute: null,
      expected: null,
      expectedError: AppError.NotFound("Route not found"),
    },
    {
      name: "should throw Forbidden if company mismatch",
      input: { comId: 1, routeId: 1 },
      mockRoute: { route_com_id: 2 },
      expected: null,
      expectedError: AppError.Forbidden("Route: Company ID does not match"),
    },
  ];

  const create_cases = [
    {
      name: "should create route",
      input: {
        comId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockDate: { route_date_com_id: 1 },
      mockTime: { route_time_com_id: 1 },
      expectedError: null,
    },
    {
      name: "should throw Forbidden if route_com_id mismatch",
      input: {
        comId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 2,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      expectedError: AppError.Forbidden("Route: Company ID does not match"),
    },
    {
      name: "should throw NotFound if date not found",
      input: {
        comId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockDate: null,
      expectedError: AppError.NotFound("Date not found"),
    },
    {
      name: "should throw Forbidden if date company mismatch",
      input: {
        comId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockDate: { route_date_com_id: 2 },
      expectedError: AppError.Forbidden("Date: Company ID does not match"),
    },
    {
      name: "should throw NotFound if time not found",
      input: {
        comId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockDate: { route_date_com_id: 1 },
      mockTime: null,
      expectedError: AppError.NotFound("Time not found"),
    },
    {
      name: "should throw Forbidden if time company mismatch",
      input: {
        comId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockDate: { route_date_com_id: 1 },
      mockTime: { route_time_com_id: 2 },
      expectedError: AppError.Forbidden("Time: Company ID does not match"),
    },
    {
      name: "should throw Forbidden if date company mismatch",
      input: {
        comId: 1,
        data: {
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 1,
        } as Route,
      },
      mockDate: { route_date_com_id: 2 },
      expectedError: AppError.Forbidden("Date: Company ID does not match"),
    },
    {
      name: "should throw Forbidden if time company mismatch",
      input: {
        comId: 1,
        data: {
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 1,
        } as Route,
      },
      mockDate: { route_date_com_id: 1 },
      mockTime: { route_time_com_id: 2 },
      expectedError: AppError.Forbidden("Time: Company ID does not match"),
    },
  ];

  const update_cases = [
    {
      name: "should update route",
      input: {
        comId: 1,
        routeId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockRoute: { route_com_id: 1 },
      mockDate: { route_date_com_id: 1 },
      mockTime: { route_time_com_id: 1 },
      expectedResult: { success: true },
      expectedError: null,
    },
    {
      name: "should throw NotFound if route not found",
      input: { comId: 1, routeId: 999, data: {} as Route },
      mockRoute: null,
      expectedError: AppError.NotFound("Route not found"),
    },
    {
      name: "should throw Forbidden if route company mismatch",
      input: {
        comId: 1,
        routeId: 1,
        data: {
          route_com_id: 1,
          route_date_id: 10,
          route_time_id: 20,
        } as Route,
      },
      mockRoute: { route_com_id: 2 },
      expectedError: AppError.Forbidden("Route: Company ID does not match"),
    },
    {
      name: "should throw NotFound if date not found",
      input: {
        comId: 1,
        routeId: 1,
        data: {
          route_name_th: "เส้นทางหลักในกรุงเทพ559",
          route_name_en: "Main Route Bangkok",
          route_color: "#FF5733",
          route_status: 1,
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 7,
          route_array: "1,2,3,1,2",
        } as Route,
      },
      mockRoute: { route_com_id: 1 },
      mockDate: null,
      expectedError: AppError.NotFound("Date not found"),
    },
    {
      name: "should throw NotFound if date not found",
      input: {
        comId: 1,
        routeId: 1,
        data: {
          route_com_id: 1,
          route_date_id: 99,
          route_time_id: 1,
        } as Route,
      },
      mockRoute: { route_com_id: 1 },
      mockDate: null,
      expectedError: AppError.NotFound("Date not found"),
    },
    {
      name: "should throw Forbidden if date company mismatch",
      input: {
        comId: 1,
        routeId: 1,
        data: {
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 1,
        } as Route,
      },
      mockRoute: { route_com_id: 1 },
      mockDate: { route_date_com_id: 2 },
      expectedError: AppError.Forbidden("Date: Company ID does not match"),
    },
    {
      name: "should return updated route on success",
      input: {
        comId: 1,
        routeId: 1,
        data: {
          route_com_id: 1,
          route_date_id: 1,
          route_time_id: 1,
        } as Route,
      },
      mockRoute: { route_com_id: 1 },
      mockDate: { route_date_com_id: 1 },
      mockTime: { route_time_com_id: 1 },
      expectedResult: { id: 1 },
      expectedError: null,
    },
  ];

  const delete_cases = [
    {
      name: "should delete route",
      input: { comId: 1, routeId: 1 },
      mockRoute: { route_com_id: 1 },
      expectedError: null,
    },
    {
      name: "should throw NotFound if route to delete not found",
      input: { comId: 1, routeId: 999 },
      mockRoute: null,
      expectedError: AppError.NotFound("Route not found"),
    },
    {
      name: "should throw Forbidden if company mismatch on delete",
      input: { comId: 1, routeId: 1 },
      mockRoute: { route_com_id: 2 },
      expectedError: AppError.Forbidden("Route: Company ID does not match"),
    },
  ];

  describe("RouteService.getByPagination", () => {
    getByPagination_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        mockRouteRepository.getPaginated.mockResolvedValueOnce(
          testCase.mockPaginatedResult
        );

        if (testCase.expectedError) {
          await expect(
            routeService.getByPagination(
              testCase.input.comId,
              testCase.input.page,
              testCase.input.size,
              testCase.input.search
            )
          ).rejects.toThrow(testCase.expectedError.message);
        } else {
          const result = await routeService.getByPagination(
            testCase.input.comId,
            testCase.input.page,
            testCase.input.size,
            testCase.input.search
          );
          expect(result).toEqual(testCase.mockPaginatedResult);
        }
      });
    });
  });

  describe("RouteService.getById", () => {
    getById_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        mockRouteRepository.getById.mockResolvedValueOnce(testCase.mockRoute);
        (Util.ValidCompany as jest.Mock).mockReturnValueOnce(
          testCase.mockRoute?.route_com_id === testCase.input.comId
        );

        if (testCase.expectedError) {
          await expect(
            routeService.getById(testCase.input.comId, testCase.input.routeId)
          ).rejects.toThrow(testCase.expectedError.message);
        } else {
          const result = await routeService.getById(
            testCase.input.comId,
            testCase.input.routeId
          );
          expect(result).toEqual(testCase.expected);
        }
      });
    });
  });

  describe("RouteService.create", () => {
    create_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        (Util.ValidCompany as jest.Mock).mockImplementation(
          (comId, dataComId) => comId === dataComId
        );

        if (testCase.expectedError?.message.includes("Route")) {
          (Util.ValidCompany as jest.Mock).mockReturnValueOnce(false);
        } else {
          mockDateRepository.getById.mockResolvedValueOnce(testCase.mockDate);
          mockTimeRepository.getById.mockResolvedValueOnce(testCase.mockTime);
          (Util.ValidCompany as jest.Mock).mockReturnValue(true);
          mockRouteRepository.create.mockResolvedValueOnce({ id: 1 });
        }

        if (testCase.expectedError) {
          await expect(
            routeService.create(testCase.input.comId, testCase.input.data)
          ).rejects.toThrow(testCase.expectedError.message);
        } else {
          const result = await routeService.create(
            testCase.input.comId,
            testCase.input.data
          );
          expect(mockRouteRepository.create).toHaveBeenCalled();
          expect(result).toEqual({ id: 1 });
        }
      });
    });
  });

  describe("RouteService.update", () => {
    update_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        mockRouteRepository.getById.mockResolvedValueOnce(testCase.mockRoute);
        (Util.ValidCompany as jest.Mock).mockImplementation(
          (comId, dataComId) => comId === dataComId
        );

        if (!testCase.mockRoute) {
          await expect(
            routeService.update(
              testCase.input.comId,
              testCase.input.routeId,
              testCase.input.data
            )
          ).rejects.toThrow(testCase.expectedError.message);
          return;
        }

        if (testCase.expectedError?.message.includes("Route:")) {
          (Util.ValidCompany as jest.Mock).mockReturnValueOnce(false);
        } else {
          mockDateRepository.getById.mockResolvedValueOnce(testCase.mockDate);
          mockTimeRepository.getById.mockResolvedValueOnce(testCase.mockTime);
          mockRouteRepository.update.mockResolvedValueOnce(
            testCase.expectedResult
          );
        }

        if (testCase.expectedError) {
          await expect(
            routeService.update(
              testCase.input.comId,
              testCase.input.routeId,
              testCase.input.data
            )
          ).rejects.toThrow(testCase.expectedError.message);
        } else {
          const result = await routeService.update(
            testCase.input.comId,
            testCase.input.routeId,
            testCase.input.data
          );
          expect(result).toEqual(testCase.expectedResult);
        }
      });
    });
  });

  describe("RouteService.delete", () => {
    delete_cases.forEach((testCase) => {
      it(testCase.name, async () => {
        mockRouteRepository.getById.mockResolvedValueOnce(testCase.mockRoute);
        (Util.ValidCompany as jest.Mock).mockReturnValueOnce(
          testCase.mockRoute?.route_com_id === testCase.input.comId
        );

        if (testCase.expectedError) {
          await expect(
            routeService.delete(testCase.input.comId, testCase.input.routeId)
          ).rejects.toThrow(testCase.expectedError.message);
        } else {
          await routeService.delete(
            testCase.input.comId,
            testCase.input.routeId
          );
          expect(mockRouteRepository.delete).toHaveBeenCalledWith(
            testCase.input.routeId
          );
        }
      });
    });
  });
});
