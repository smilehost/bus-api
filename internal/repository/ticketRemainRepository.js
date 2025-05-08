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
exports.TicketRemainRepository = void 0;
var appError_1 = require("../utils/appError");
var TicketRemainRepository = /** @class */ (function () {
    function TicketRemainRepository(prisma) {
        this.prisma = prisma;
    }
    TicketRemainRepository.prototype.getById = function (ticket_remain_id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.ticket_remain.findUnique({
                                where: { ticket_remain_id: ticket_remain_id },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw appError_1.AppError.fromPrismaError(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketRemainRepository.prototype.getRemainNumber = function (date, time, route_ticket_id) {
        return __awaiter(this, void 0, void 0, function () {
            var remain, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.ticket_remain.findFirst({
                                where: {
                                    ticket_remain_date: date,
                                    ticket_remain_time: time,
                                    ticket_remain_route_ticket_id: route_ticket_id,
                                },
                            })];
                    case 1:
                        remain = _a.sent();
                        if (!remain) {
                            throw appError_1.AppError.NotFound("Ticket remain not found");
                        }
                        return [2 /*return*/, remain.ticket_remain_number];
                    case 2:
                        error_2 = _a.sent();
                        throw appError_1.AppError.fromPrismaError(error_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TicketRemainRepository.prototype.findByTicketIdDateAndTimes = function (ticket_id, date, times) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.prisma.ticket_remain.findMany({
                                where: {
                                    ticket_remain_route_ticket_id: ticket_id,
                                    ticket_remain_date: date,
                                    ticket_remain_time: {
                                        in: times,
                                    },
                                },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw appError_1.AppError.fromPrismaError(error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TicketRemainRepository;
}());
exports.TicketRemainRepository = TicketRemainRepository;
