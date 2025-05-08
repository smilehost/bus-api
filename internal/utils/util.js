"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
var appError_1 = require("./appError");
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.ValidCompany = function (com_id1, com_id2) {
        if (com_id1 === null ||
            com_id1 === undefined ||
            isNaN(com_id1) ||
            com_id2 === null ||
            com_id2 === undefined ||
            isNaN(com_id2)) {
            return false;
        }
        return com_id1 === com_id2;
    };
    // กลัวแตกจังเลย
    Util.parseId = function (input, label) {
        if (label === void 0) { label = "com_id"; }
        if (input === null || input === undefined) {
            throw appError_1.AppError.BadRequest("Missing ".concat(label));
        }
        if (Array.isArray(input)) {
            input = input[0];
        }
        if (typeof input === "number") {
            if (!Number.isInteger(input)) {
                throw appError_1.AppError.BadRequest("Invalid ".concat(label, " (not an integer)"));
            }
            return input;
        }
        if (typeof input === "string") {
            var trimmed = input.trim();
            if (trimmed === "")
                throw appError_1.AppError.BadRequest("Empty ".concat(label, " value"));
            // ✅ ตรวจว่า string นี้เป็นตัวเลขล้วน (ไม่ใช่ 1_1_1)
            if (!/^\d+$/.test(trimmed)) {
                throw appError_1.AppError.BadRequest("Invalid ".concat(label, " (not a pure number string)"));
            }
            return parseInt(trimmed, 10);
        }
        throw appError_1.AppError.BadRequest("Invalid ".concat(label, " format"));
    };
    Util.parseIdFields = function (obj) {
        var result = {};
        for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            try {
                result[key] = Util.parseId(value, key);
            }
            catch (_c) {
                result[key] = value;
            }
        }
        return result;
    };
    Util.checkObjectHasMissingFields = function (obj) {
        var missing = Object.keys(obj).filter(function (key) {
            var value = obj[key];
            return value === undefined || value === null;
        });
        return {
            valid: missing.length === 0,
            missing: missing,
        };
    };
    Util.extractRequestContext = function (req, require) {
        if (require === void 0) { require = {}; }
        var com_id = Util.parseId(req.headers["com-id"] || req.headers["com_id"]);
        var result = { com_id: com_id };
        if (require.body) {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw appError_1.AppError.BadRequest("Missing required body");
            }
            var check = Util.checkObjectHasMissingFields(req.body);
            if (!check.valid) {
                throw appError_1.AppError.BadRequest("Missing required fields in body: ".concat(check.missing.join(", ")));
            }
            result.body = req.body;
        }
        if (require.params) {
            if (!req.params || Object.keys(req.params).length === 0) {
                throw appError_1.AppError.BadRequest("Missing required params");
            }
            console.log("---------------------3");
            console.log(req.params);
            console.log("---------------------4");
            var check = Util.checkObjectHasMissingFields(req.params);
            if (!check.valid) {
                throw appError_1.AppError.BadRequest("Missing required fields in params: ".concat(check.missing.join(", ")));
            }
            console.log("---------------------5");
            console.log(req.params);
            console.log("---------------------6");
            result.params = Util.parseIdFields(req.params);
            console.log("---------------------7");
            console.log(result.params);
            console.log("---------------------8");
        }
        if (require.query) {
            if (!req.query || Object.keys(req.query).length === 0) {
                throw appError_1.AppError.BadRequest("Missing required query");
            }
            var check = Util.checkObjectHasMissingFields(req.query);
            if (!check.valid) {
                throw appError_1.AppError.BadRequest("Missing required fields in query: ".concat(check.missing.join(", ")));
            }
            result.query = Util.parseIdFields(req.query);
        }
        return result;
    };
    return Util;
}());
exports.Util = Util;
