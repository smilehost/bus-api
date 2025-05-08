"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRemainService = void 0;
var appError_1 = require("../utils/appError");
var TicketRemainService = /** @class */ (function () {
    function TicketRemainService(ticketRemainRepository) {
        this.ticketRemainRepository = ticketRemainRepository;
    }
    TicketRemainService.prototype.getById = function (comId, ticket_remain_id) {
        return __awaiter(this, void 0, void 0, function () {
            var ticketRemain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ticketRemainRepository.getById(ticket_remain_id)];
                    case 1:
                        ticketRemain = _a.sent();
                        if (!ticketRemain) {
                            throw appError_1.AppError.NotFound("Ticket remain not found");
                        }
                        return [2 /*return*/, ticketRemain];
                }
            });
        });
    };
    TicketRemainService.prototype.getRemainNumber = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket_remain_date, ticket_remain_time, ticket_remain_route_ticket_id;
            return __generator(this, function (_a) {
                ticket_remain_date = dto.ticket_remain_date, ticket_remain_time = dto.ticket_remain_time, ticket_remain_route_ticket_id = dto.ticket_remain_route_ticket_id;
                if (!ticket_remain_date ||
                    !ticket_remain_time ||
                    !ticket_remain_route_ticket_id) {
                    throw appError_1.AppError.BadRequest("Missing required fields");
                }
                return [2 /*return*/, this.ticketRemainRepository.getRemainNumber(ticket_remain_date, ticket_remain_time, ticket_remain_route_ticket_id)];
            });
        });
    };
    TicketRemainService.prototype.getRemainByRouteTime = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var times, remains, remainMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        times = dto.ticket_remain_time.split(",").map(function (t) { return t.trim(); });
                        return [4 /*yield*/, this.ticketRemainRepository.findByTicketIdDateAndTimes(dto.ticket_id, dto.ticket_remain_date, times)];
                    case 1:
                        remains = _a.sent();
                        remainMap = new Map(remains.map(function (remain) { return [remain.ticket_remain_time, remain]; }));
                        return [2 /*return*/, times.map(function (time) {
                                var found = remainMap.get(time);
                                return (found !== null && found !== void 0 ? found : {
                                    ticket_remain_id: null,
                                    ticket_remain_date: dto.ticket_remain_date,
                                    ticket_remain_time: time,
                                    ticket_remain_number: null,
                                    ticket_remain_route_ticket_id: dto.ticket_id,
                                });
                            })];
                }
            });
        });
    };
    return TicketRemainService;
}());
exports.TicketRemainService = TicketRemainService;
