import { Request, Response } from "express";
import { DateController } from "../../internal/controller/dateController";
import { DateService } from "../../internal/service/dateService";
import { RouteDate } from "../../cmd/models";

describe("DateController", () => {
  let controller: DateController;
  let mockService: jest.Mocked<DateService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<DateService>;

    controller = new DateController(mockService);

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe("getAll", () => {
    it("should return 404 if no data found", async () => {
      mockService.getAll.mockResolvedValue([]);

      await controller.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "No data found" });
    });

    it("should return data if found", async () => {
      const mockData = [
        { route_date_id: 1, route_date_name: "Test" },
      ] as RouteDate[];
      mockService.getAll.mockResolvedValue(mockData);

      await controller.getAll(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(mockData);
    });
  });

  describe("getById", () => {
    it("should return 400 if id is invalid", async () => {
      mockReq.params = { id: "abc" };

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid ID" });
    });

    it("should return 404 if not found", async () => {
      mockReq.params = { id: "1" };
      mockService.getById.mockResolvedValue(null);

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Data not found" });
    });

    it("should return data if found", async () => {
      const item = { route_date_id: 1, route_date_name: "Test" } as RouteDate;
      mockReq.params = { id: "1" };
      mockService.getById.mockResolvedValue(item);

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(item);
    });
  });

});
