import { Request, Response } from "express";
import { TimeController } from "./timeController"; // path ตามจริง
import { TimeService } from "../service/timeService";

describe("TimeController - create", () => {
  let mockTimeService: Partial<TimeService>;
  let controller: TimeController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockTimeService = {
      create: jest.fn().mockResolvedValue({ id: 1 }),
    };

    controller = new TimeController(mockTimeService as TimeService);

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("should return 201 if data is valid", async () => {
    req = {
      body: {
        routeTimeName: "test name",
        routeTimeArray: ["08:00", "09:00"],
        routeTimeComIdd: 1,
      },
    };

    await controller.create(req as Request, res as Response);

    expect(mockTimeService.create).toHaveBeenCalledWith({
      route_time_id: 0,
      route_time_name: "test name",
      route_time_array: "08:00,09:00",
      route_time_com_id: 1,
    });

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: "Created successfully",
      result: { id: 1 },
    });
  });

  it("should return 400 for invalid time format", async () => {
    req = {
      body: {
        routeTimeName: "test name",
        routeTimeArray: ["08:00", "invalid"],
        routeTimeComIdd: 1,
      },
    };

    await controller.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error:
        'Invalid input: routeTimeArray must be an array of strings in HH:mm format (e.g., "08:30")',
    });
  });

  it("should return 400 if name or comId is invalid", async () => {
    req = {
      body: {
        routeTimeName: 123,
        routeTimeArray: ["08:00"],
        routeTimeComIdd: "bad",
      },
    };

    await controller.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Invalid routeTimeName or routeTimeComIdd",
    });
  });

  it("should return 500 if service throws error", async () => {
    mockTimeService.create = jest.fn().mockRejectedValue(new Error("fail"));
    controller = new TimeController(mockTimeService as TimeService);

    req = {
      body: {
        routeTimeName: "test",
        routeTimeArray: ["08:00"],
        routeTimeComIdd: 1,
      },
    };

    await controller.create(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });

  it("should update and return data if input is valid", async () => {
    req = {
      headers: { com_id: "1" },
      params: { route_time_id: "10" },
      body: {
        route_time_name: "Updated Name",
      },
    };

    await controller.update(req as Request, res as Response);

    expect(mockTimeService.update).toHaveBeenCalledWith(1, 10, {
      route_time_name: "Updated Name",
    });

    expect(res.json).toHaveBeenCalledWith({ route_time_id: 1, updated: true });
  });

  it("should return 400 if com_id is invalid", async () => {
    req = {
      headers: { com_id: "invalid" },
      params: { route_time_id: "10" },
      body: {},
    };

    await controller.update(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Invalid or missing com_id in headers",
    });
  });

  it("should return 400 if route_time_id is invalid", async () => {
    req = {
      headers: { com_id: "1" },
      params: { route_time_id: "invalid" },
      body: {},
    };

    await controller.update(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Invalid route_time_id",
    });
  });

  it("should return 500 if service throws error", async () => {
    mockTimeService.update = jest.fn().mockRejectedValue(new Error("fail"));
    controller = new TimeController(mockTimeService as TimeService);

    req = {
      headers: { com_id: "1" },
      params: { route_time_id: "10" },
      body: {
        route_time_array: "10:00,11:00",
      },
    };

    await controller.update(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
  });
});
