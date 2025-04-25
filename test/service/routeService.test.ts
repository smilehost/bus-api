import { RouteService } from "../../internal/service/routeService";
import { Util } from "../../internal/utils/util"; // ต้อง import เพิ่ม

jest.mock("../../internal/utils/util", () => ({
  Util: {
    ValidCompany: jest.fn((a, b) => a === b), // default: เทียบตรงกัน
  },
}));

jest.mock("../../internal/utils/appError", () => {
  const actual = jest.requireActual("../../internal/utils/appError");

  return {
    ...actual,
    AppError: {
      ...actual.AppError,
      BadRequest: jest.fn((msg: string) => new actual.AppError(msg, 400)),
      Forbidden: jest.fn((msg: string) => new actual.AppError(msg, 403)),
      NotFound: jest.fn((msg: string) => new actual.AppError(msg, 404)),
      Conflict: jest.fn((msg: string) => new actual.AppError(msg, 409)),
      Internal: jest.fn((msg: string) => new actual.AppError(msg, 500)),
      fromPrismaError: jest.fn(actual.AppError.fromPrismaError),
    },
  };
});

describe("RouteService", () => {
  let service: RouteService;
  let mockRouteRepo: any;
  let mockDateRepo: any;
  let mockTimeRepo: any;

  beforeEach(() => {
    mockRouteRepo = {
      getPaginated: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockDateRepo = {
      getById: jest.fn(),
    };

    mockTimeRepo = {
      getById: jest.fn(),
    };

    service = new RouteService(mockRouteRepo, mockDateRepo, mockTimeRepo);
  });

  describe("getByPagination", () => {
    it("should return paginated data", async () => {
      mockRouteRepo.getPaginated.mockResolvedValue([
        [
          {
            route_id: 30,
            route_name_th: "เส้นทางหลักในกรุงเทพฯ",
            route_name_en: "Main Route Bangkok",
            route_color: "#FF5733",
            route_status: 1,
            route_com_id: 1,
            date_id: 1,
            time_id: 7,
            route_array: "1,2,3,1,2",
          },
          {
            route_id: 27,
            route_name_th: "เส้นทางหลักในกรุงเทพฯ",
            route_name_en: "Main Route Bangkok",
            route_color: "#FF5733",
            route_status: 1,
            route_com_id: 1,
            date_id: 1,
            time_id: 7,
            route_array: "A1,A2,A3,B1,B2",
          },
        ],
        27,
      ]);

      const result = await service.getByPagination(1, 1, 5, "main");

      expect(result).toEqual({
        page: 1,
        size: 5,
        total: 27,
        totalPages: Math.ceil(27 / 5),
        data: [
          {
            route_id: 30,
            route_name_th: "เส้นทางหลักในกรุงเทพฯ",
            route_name_en: "Main Route Bangkok",
            route_color: "#FF5733",
            route_status: 1,
            route_com_id: 1,
            date_id: 1,
            time_id: 7,
            route_array: "1,2,3,1,2",
          },
          {
            route_id: 27,
            route_name_th: "เส้นทางหลักในกรุงเทพฯ",
            route_name_en: "Main Route Bangkok",
            route_color: "#FF5733",
            route_status: 1,
            route_com_id: 1,
            date_id: 1,
            time_id: 7,
            route_array: "A1,A2,A3,B1,B2",
          },
        ],
      });
    });
  });

  describe("getById", () => {
    it("should return route if found and valid company", async () => {
      mockRouteRepo.getById.mockResolvedValue({
        route_id: 27,
        route_name_th: "เส้นทางหลักในกรุงเทพฯ",
        route_name_en: "Main Route Bangkok",
        route_color: "#FF5733",
        route_status: 1,
        route_com_id: 1,
        date_id: 1,
        time_id: 7,
        route_array: "A1,A2,A3,B1,B2",
      });

      const result = await service.getById(1, 27);

      expect(result).toEqual({
        route_id: 27,
        route_name_th: "เส้นทางหลักในกรุงเทพฯ",
        route_name_en: "Main Route Bangkok",
        route_color: "#FF5733",
        route_status: 1,
        route_com_id: 1,
        date_id: 1,
        time_id: 7,
        route_array: "A1,A2,A3,B1,B2",
      });
    });

    it("should throw 404 if not found", async () => {
      mockRouteRepo.getById.mockResolvedValue(null);

      await expect(service.getById(1, 99)).rejects.toThrow("Route not found");
    });

    it("should throw 403 if company ID mismatch", async () => {
      mockRouteRepo.getById.mockResolvedValue({
        route_com_id: 1,
        route_id: 2,
        route_name_th: "เส้นทางหลักในกรุงเทพฯ",
        route_name_en: "Main Route Bangkok",
        route_color: "#FF5733",
        route_status: 1,
        date_id: 1,
        time_id: 7,
        route_array: "A1,A2,A3,B1,B2",
      });

      (Util.ValidCompany as jest.Mock).mockReturnValue(false); // 👈 จำเป็นต้อง mock ให้ไม่ตรง

      await expect(service.getById(2, 2)).rejects.toThrow(
        "Route: Company ID does not match"
      );
    });
  });

  describe("create", () => {
    const data = {
      route_com_id: 1,
      date_id: 1,
      time_id: 1,
    };

    it("should create route", async () => {
      mockDateRepo.getById.mockResolvedValue({ route_date_com_id: 1 });
      mockTimeRepo.getById.mockResolvedValue({ route_time_com_id: 1 });
      mockRouteRepo.create.mockResolvedValue({ route_id: 1 });

      const result = await service.create(1, data as any);
      expect(result.route_id).toBe(1);
    });

    it("should fail if company mismatch", async () => {
      await expect(
        service.create(2, { ...data, route_com_id: 1 } as any)
      ).rejects.toThrow("Company ID does not match");
    });

    it("should fail if date not found", async () => {
      mockDateRepo.getById.mockResolvedValue(null);

      await expect(service.create(1, data as any)).rejects.toThrow(
        "Date not found"
      );
    });

    it("should fail if date company mismatch", async () => {
      mockDateRepo.getById.mockResolvedValue({ route_date_com_id: 2 });

      await expect(service.create(1, data as any)).rejects.toThrow(
        "Company ID does not match"
      );
    });

    it("should fail if time not found", async () => {
      mockDateRepo.getById.mockResolvedValue({ route_date_com_id: 1 });
      mockTimeRepo.getById.mockResolvedValue(null);

      await expect(service.create(1, data as any)).rejects.toThrow(
        "Time not found"
      );
    });

    it("should fail if time company mismatch", async () => {
      mockDateRepo.getById.mockResolvedValue({ route_date_com_id: 1 });
      mockTimeRepo.getById.mockResolvedValue({ route_time_com_id: 2 });

      await expect(service.create(1, data as any)).rejects.toThrow(
        "Company ID does not match"
      );
    });
  });

  describe("update", () => {
    const data = {
      route_com_id: 1,
      date_id: 1,
      time_id: 1,
    };

    it("should update route", async () => {
      mockRouteRepo.getById.mockResolvedValue({ route_com_id: 1 });
      mockDateRepo.getById.mockResolvedValue({ route_date_com_id: 1 });
      mockTimeRepo.getById.mockResolvedValue({ route_time_com_id: 1 });
      mockRouteRepo.update.mockResolvedValue({ route_id: 1 });

      const result = await service.update(1, 1, data as any);
      expect(result.route_id).toBe(1);
    });

    it("should fail if route not found", async () => {
      mockRouteRepo.getById.mockResolvedValue(null);

      await expect(service.update(1, 1, data as any)).rejects.toThrow(
        "Route not found"
      );
    });

    it("should fail if company mismatch", async () => {
      mockRouteRepo.getById.mockResolvedValue({ route_com_id: 2 });

      await expect(service.update(1, 1, data as any)).rejects.toThrow(
        "Company ID does not match"
      );
    });

    // ซ้ำ create cases: date/time not found or mismatch (skip เขียนซ้ำเพื่อย่น)
  });

  describe("delete", () => {
    it("should delete route if valid", async () => {
      mockRouteRepo.getById.mockResolvedValue({ route_com_id: 1 });
      mockRouteRepo.delete.mockResolvedValue(undefined);

      const result = await service.delete(1, 1);
      expect(result).toBeUndefined();
    });

    it("should fail if not found", async () => {
      mockRouteRepo.getById.mockResolvedValue(null);

      await expect(service.delete(1, 1)).rejects.toThrow("Route not found");
    });

    it("should fail if company mismatch", async () => {
      mockRouteRepo.getById.mockResolvedValue({ route_com_id: 2 });

      await expect(service.delete(1, 1)).rejects.toThrow(
        "Company ID does not match"
      );
    });
  });
});
