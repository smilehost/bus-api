"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
var client_1 = require("@prisma/client");
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(message, statusCode) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.name = AppError.getHttpErrorName(statusCode);
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    AppError.getHttpErrorName = function (code) {
        var _a;
        var map = {
            400: "Bad Request",
            401: "Unauthorized",
            403: "Forbidden",
            404: "Not Found",
            409: "Conflict",
            500: "Internal Server Error",
        };
        return (_a = map[code]) !== null && _a !== void 0 ? _a : "Error";
    };
    AppError.BadRequest = function (msg) {
        return new AppError(msg, 400);
    };
    AppError.Unauthorized = function (msg) {
        return new AppError(msg, 401);
    };
    AppError.Forbidden = function (msg) {
        return new AppError(msg, 403);
    };
    AppError.NotFound = function (msg) {
        return new AppError(msg, 404);
    };
    AppError.Conflict = function (msg) {
        return new AppError(msg, 409);
    };
    AppError.Internal = function (msg) {
        return new AppError(msg, 500);
    };
    AppError.fromPrismaError = function (error) {
        var _a, _b;
        if (error instanceof client_1.Prisma.PrismaClientValidationError) {
            var fieldMatch = RegExp(/Argument `(\w+)` is missing/).exec(error.message);
            if (fieldMatch) {
                var missingField = fieldMatch[1];
                return AppError.BadRequest("Missing required field: ".concat(missingField));
            }
            return AppError.BadRequest("Invalid input data");
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002":
                    return AppError.Conflict("Duplicate value for unique field(s): ".concat((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.join(", ")));
                case "P2025":
                    return AppError.NotFound(error.message || "Record not found");
            }
            return AppError.BadRequest("Invalid request to database");
        }
        return AppError.Internal("Unexpected database error");
    };
    return AppError;
}(Error));
exports.AppError = AppError;
