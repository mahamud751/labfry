/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const throttler_1 = __webpack_require__(6);
const auth_module_1 = __webpack_require__(7);
const health_module_1 = __webpack_require__(24);
const websocket_module_1 = __webpack_require__(26);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 3,
                },
            ]),
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            websocket_module_1.WebSocketModule,
        ],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const auth_controller_1 = __webpack_require__(8);
const auth_service_1 = __webpack_require__(10);
const prisma_service_1 = __webpack_require__(13);
const jwt_service_1 = __webpack_require__(15);
const email_service_1 = __webpack_require__(18);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, prisma_service_1.PrismaService, jwt_service_1.JWTService, email_service_1.EmailService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const throttler_1 = __webpack_require__(6);
const express_1 = __webpack_require__(9);
const auth_service_1 = __webpack_require__(10);
const jwt_service_1 = __webpack_require__(15);
const auth_dto_1 = __webpack_require__(20);
const response_dto_1 = __webpack_require__(23);
const email_service_1 = __webpack_require__(18);
let AuthController = class AuthController {
    constructor(authService, emailService, jwtService) {
        this.authService = authService;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async login(loginDto, res) {
        const result = await this.authService.login(loginDto);
        if (!result.success) {
            res.status(common_1.HttpStatus.UNAUTHORIZED);
            return result;
        }
        res.status(common_1.HttpStatus.OK);
        if (result.token && result.refreshToken) {
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }
        return result;
    }
    async verifyEmail(verifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async resetPassword(resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
    async refreshToken(req, body, res) {
        const refreshToken = req.cookies?.refreshToken || body.refreshToken;
        if (!refreshToken) {
            res.status(common_1.HttpStatus.UNAUTHORIZED);
            return {
                success: false,
                message: "Refresh token is required",
            };
        }
        const result = await this.authService.refreshToken(refreshToken);
        if (!result.success) {
            res.status(common_1.HttpStatus.UNAUTHORIZED);
            return result;
        }
        res.status(common_1.HttpStatus.OK);
        if (result.token && result.refreshToken) {
            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }
        return result;
    }
    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith("Bearer ")
                ? authHeader.slice(7)
                : null;
            let sessionId = null;
            if (token) {
                try {
                    const payload = this.jwtService.verifyToken(token);
                    sessionId = payload.sessionId;
                }
                catch (error) {
                    console.log("Invalid token during logout, proceeding with cookie cleanup");
                }
            }
            if (sessionId) {
                try {
                    await this.authService.logout(sessionId);
                }
                catch (error) {
                    console.error("Session invalidation failed:", error);
                }
            }
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return {
                success: true,
                message: "Logged out successfully",
            };
        }
        catch (error) {
            console.error("Logout error:", error);
            res.clearCookie("token");
            res.clearCookie("refreshToken");
            return {
                success: true,
                message: "Logged out successfully",
            };
        }
    }
    async getProfile(req) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith("Bearer ")
                ? authHeader.slice(7)
                : null;
            if (!token) {
                return {
                    success: false,
                    message: "Authentication required",
                };
            }
            let payload;
            try {
                payload = this.jwtService.verifyToken(token);
            }
            catch (error) {
                return {
                    success: false,
                    message: "Invalid or expired token",
                };
            }
            const user = await this.authService.getUserProfile(payload.userId);
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }
            return {
                success: true,
                message: "Profile retrieved successfully",
                user,
            };
        }
        catch (error) {
            console.error("Get profile error:", error);
            return {
                success: false,
                message: "Authentication failed",
            };
        }
    }
    async updateProfile(req, updateProfileDto) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith("Bearer ")
                ? authHeader.slice(7)
                : null;
            if (!token) {
                return {
                    success: false,
                    message: "Authentication required",
                };
            }
            let payload;
            try {
                payload = this.jwtService.verifyToken(token);
            }
            catch (error) {
                return {
                    success: false,
                    message: "Invalid or expired token",
                };
            }
            return this.authService.updateProfile(payload.userId, updateProfileDto);
        }
        catch (error) {
            console.error("Update profile error:", error);
            return {
                success: false,
                message: "Authentication failed",
            };
        }
    }
    async updateOnlineStatus(req, onlineStatusDto) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.startsWith("Bearer ")
                ? authHeader.slice(7)
                : null;
            if (!token) {
                return {
                    success: false,
                    message: "Authentication required",
                };
            }
            let payload;
            try {
                payload = this.jwtService.verifyToken(token);
            }
            catch (error) {
                return {
                    success: false,
                    message: "Invalid or expired token",
                };
            }
            await this.authService.updateOnlineStatus(payload.userId, onlineStatusDto.isOnline);
            return {
                success: true,
                message: "Online status updated successfully",
            };
        }
        catch (error) {
            console.error("Update online status error:", error);
            return {
                success: false,
                message: "Failed to update online status",
            };
        }
    }
    async resendVerification(resendDto) {
        return this.authService.resendVerificationCode(resendDto.email);
    }
    async adminResetPassword(req, adminResetDto) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;
        if (!token) {
            return {
                success: false,
                message: "Authentication required",
            };
        }
        const adminUserId = req.body.adminUserId || "temp-admin-id";
        return this.authService.adminResetPassword(adminUserId, adminResetDto.targetEmail, adminResetDto.newPassword);
    }
    async emailHealthCheck() {
        try {
            const isConnected = await this.emailService.testConnection();
            return {
                success: isConnected,
                message: isConnected
                    ? "Email service is working correctly"
                    : "Email service connection failed",
                config: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    user: process.env.SMTP_USER ? "***configured***" : "missing",
                    from: process.env.FROM_EMAIL,
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                message: "Failed to test email connection",
                error: error.message,
                timestamp: new Date().toISOString(),
            };
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "User registration",
        description: "Register a new user account with email verification",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Registration successful",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Registration failed - validation errors or user exists",
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, throttler_1.Throttle)({ default: { limit: 2, ttl: 300000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof auth_dto_1.RegisterDto !== "undefined" && auth_dto_1.RegisterDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "User authentication login",
        description: "Authenticate user with email and password",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Login successful",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Login failed - invalid credentials or account issues",
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 429,
        description: "Too many requests. Please try again in 1 minute.",
        type: response_dto_1.RateLimitResponseDto,
    }),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof auth_dto_1.LoginDto !== "undefined" && auth_dto_1.LoginDto) === "function" ? _f : Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("verify-email"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Verify user email address",
        description: "Verify user email address using either a JWT token or 6-digit code",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Email verified successfully",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Email verification failed",
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof auth_dto_1.VerifyEmailDto !== "undefined" && auth_dto_1.VerifyEmailDto) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Request password reset",
        description: "Send password reset code to user email address",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Password reset email sent (always returned for security)",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, throttler_1.Throttle)({ default: { limit: 2, ttl: 300000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof auth_dto_1.ForgotPasswordDto !== "undefined" && auth_dto_1.ForgotPasswordDto) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Reset user password",
        description: "Reset user password using token or code from email",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Password reset successful",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Password reset failed",
        type: response_dto_1.ErrorResponseDto,
    }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof auth_dto_1.ResetPasswordDto !== "undefined" && auth_dto_1.ResetPasswordDto) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Refresh authentication token",
        description: "Get new access token using refresh token",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Token refreshed successfully",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Token refresh failed",
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _q : Object, Object, typeof (_r = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _r : Object]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "User logout",
        description: "Logout user and invalidate session",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Logout successful",
        type: response_dto_1.AuthResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _t : Object, typeof (_u = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Get user profile",
        description: "Get authenticated user profile information",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile retrieved successfully",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Authentication required",
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_w = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)("profile"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: "Update user profile",
        description: "Update authenticated user profile information",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Profile updated successfully",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Authentication required",
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_y = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _y : Object, typeof (_z = typeof auth_dto_1.UpdateProfileDto !== "undefined" && auth_dto_1.UpdateProfileDto) === "function" ? _z : Object]),
    __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)("online-status"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({
        summary: "Update online status",
        description: "Update user online/offline status",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Online status updated successfully",
        type: response_dto_1.AuthResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_1 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _1 : Object, Object]),
    __metadata("design:returntype", typeof (_2 = typeof Promise !== "undefined" && Promise) === "function" ? _2 : Object)
], AuthController.prototype, "updateOnlineStatus", null);
__decorate([
    (0, common_1.Post)("resend-verification"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Resend email verification",
        description: "Send new verification code to user email",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Verification code sent",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, throttler_1.Throttle)({ default: { limit: 2, ttl: 300000 } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)("admin/reset-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, swagger_1.ApiOperation)({
        summary: "Admin reset password",
        description: "Admin function to reset user password",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Password reset successfully",
        type: response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Admin access required",
        type: response_dto_1.ErrorResponseDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_4 = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _4 : Object, typeof (_5 = typeof auth_dto_1.AdminResetPasswordDto !== "undefined" && auth_dto_1.AdminResetPasswordDto) === "function" ? _5 : Object]),
    __metadata("design:returntype", typeof (_6 = typeof Promise !== "undefined" && Promise) === "function" ? _6 : Object)
], AuthController.prototype, "adminResetPassword", null);
__decorate([
    (0, common_1.Get)("email-health"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Email service health check",
        description: "Check email service connectivity and configuration",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Email service status",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_7 = typeof Promise !== "undefined" && Promise) === "function" ? _7 : Object)
], AuthController.prototype, "emailHealthCheck", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _b : Object, typeof (_c = typeof jwt_service_1.JWTService !== "undefined" && jwt_service_1.JWTService) === "function" ? _c : Object])
], AuthController);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const bcrypt = __webpack_require__(11);
const uuid_1 = __webpack_require__(12);
const prisma_service_1 = __webpack_require__(13);
const jwt_service_1 = __webpack_require__(15);
const verification_service_1 = __webpack_require__(17);
const email_service_1 = __webpack_require__(18);
let AuthService = class AuthService {
    constructor(prisma, jwtService, emailService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async register(data) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                return {
                    success: false,
                    message: "User with this email already exists",
                };
            }
            const hashedPassword = await bcrypt.hash(data.password, 12);
            const emailVerificationToken = this.jwtService.generateEmailVerificationToken(data.email);
            const emailVerificationCode = (0, verification_service_1.generateVerificationCode)();
            const user = await this.prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role || "USER",
                    emailVerificationToken,
                    emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    emailVerificationCode,
                    emailVerificationCodeExpiry: (0, verification_service_1.getCodeExpiryTime)(),
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    isOnline: true,
                    lastSeen: true,
                },
            });
            await this.emailService.sendEmailVerification(data.email, emailVerificationToken, data.firstName, emailVerificationCode);
            return {
                success: true,
                message: "Registration successful. Please check your email to verify your account.",
                user,
            };
        }
        catch (error) {
            console.error("Registration error:", error);
            throw new Error("Registration failed");
        }
    }
    async login(data) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                return {
                    success: false,
                    message: "Invalid email or password",
                };
            }
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid email or password",
                };
            }
            if (user.status !== "ACTIVE" && user.status !== "PENDING_VERIFICATION") {
                return {
                    success: false,
                    message: "Account is suspended or deleted",
                };
            }
            const sessionId = (0, uuid_1.v4)();
            const sessionExpireTime = this.configService.get("SESSION_EXPIRE_TIME") || 24 * 60 * 60 * 1000;
            const refreshExpireTime = this.configService.get("REFRESH_SESSION_EXPIRE_TIME") ||
                7 * 24 * 60 * 60 * 1000;
            const expiresAt = new Date(Date.now() + sessionExpireTime);
            const refreshExpiresAt = new Date(Date.now() + refreshExpireTime);
            const jwtPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
                sessionId,
            };
            const token = this.jwtService.generateToken(jwtPayload);
            const refreshToken = this.jwtService.generateRefreshToken(jwtPayload);
            const session = await this.prisma.session.create({
                data: {
                    userId: user.id,
                    token,
                    refreshToken,
                    expiresAt: data.rememberMe ? refreshExpiresAt : expiresAt,
                },
            });
            const updatedJwtPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
                sessionId: session.id,
            };
            const finalToken = this.jwtService.generateToken(updatedJwtPayload);
            const finalRefreshToken = this.jwtService.generateRefreshToken(updatedJwtPayload);
            await this.prisma.session.update({
                where: { id: session.id },
                data: {
                    token: finalToken,
                    refreshToken: finalRefreshToken,
                },
            });
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    isOnline: true,
                    lastSeen: new Date(),
                },
            });
            const userResponse = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                status: user.status,
                emailVerified: user.emailVerified,
                isOnline: true,
                lastSeen: new Date(),
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
            return {
                success: true,
                message: "Login successful",
                user: userResponse,
                token: finalToken,
                refreshToken: finalRefreshToken,
            };
        }
        catch (error) {
            console.error("Login error:", error);
            throw new Error("Login failed");
        }
    }
    async verifyEmail(data) {
        try {
            let user;
            if (data.token) {
                const { email } = this.jwtService.verifyEmailVerificationToken(data.token);
                user = await this.prisma.user.findUnique({
                    where: { email },
                });
            }
            else if (data.code && data.email) {
                if (!(0, verification_service_1.isValidCodeFormat)(data.code)) {
                    return {
                        success: false,
                        message: "Invalid verification code format",
                    };
                }
                user = await this.prisma.user.findUnique({
                    where: { email: data.email },
                });
                if (!user || user.emailVerificationCode !== data.code) {
                    return {
                        success: false,
                        message: "Invalid verification code",
                    };
                }
                if ((0, verification_service_1.isCodeExpired)(user.emailVerificationCodeExpiry)) {
                    return {
                        success: false,
                        message: "Verification code has expired",
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: "Either token or code with email is required",
                };
            }
            if (!user) {
                return {
                    success: false,
                    message: "Invalid verification token or code",
                };
            }
            if (user.emailVerified) {
                return {
                    success: false,
                    message: "Email is already verified",
                };
            }
            if (data.token &&
                user.emailVerificationTokenExpiry &&
                new Date() > user.emailVerificationTokenExpiry) {
                return {
                    success: false,
                    message: "Verification token has expired",
                };
            }
            const updatedUser = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: true,
                    status: "ACTIVE",
                    emailVerificationToken: null,
                    emailVerificationTokenExpiry: null,
                    emailVerificationCode: null,
                    emailVerificationCodeExpiry: null,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    isOnline: true,
                    lastSeen: true,
                },
            });
            await this.emailService.sendWelcomeEmail(user.email, user.firstName);
            return {
                success: true,
                message: "Email verified successfully",
                user: updatedUser,
            };
        }
        catch (error) {
            console.error("Email verification error:", error);
            return {
                success: false,
                message: "Invalid or expired verification token or code",
            };
        }
    }
    async forgotPassword(data) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                return {
                    success: true,
                    message: "If an account with this email exists, a password reset link has been sent.",
                };
            }
            const resetToken = this.jwtService.generatePasswordResetToken(data.email);
            const resetCode = (0, verification_service_1.generateVerificationCode)();
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordResetToken: resetToken,
                    passwordResetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
                    passwordResetCode: resetCode,
                    passwordResetCodeExpiry: (0, verification_service_1.getCodeExpiryTime)(),
                },
            });
            await this.emailService.sendPasswordReset(data.email, resetToken, user.firstName, resetCode);
            return {
                success: true,
                message: "If an account with this email exists, a password reset link has been sent.",
            };
        }
        catch (error) {
            console.error("Forgot password error:", error);
            throw new Error("Failed to process password reset request");
        }
    }
    async resetPassword(data) {
        try {
            let user;
            if (data.token) {
                const { email } = this.jwtService.verifyPasswordResetToken(data.token);
                user = await this.prisma.user.findUnique({
                    where: { email },
                });
                if (!user || user.passwordResetToken !== data.token) {
                    return {
                        success: false,
                        message: "Invalid or expired reset token",
                    };
                }
                if (user.passwordResetTokenExpiry &&
                    new Date() > user.passwordResetTokenExpiry) {
                    return {
                        success: false,
                        message: "Reset token has expired",
                    };
                }
            }
            else if (data.code && data.email) {
                if (!(0, verification_service_1.isValidCodeFormat)(data.code)) {
                    return {
                        success: false,
                        message: "Invalid reset code format",
                    };
                }
                user = await this.prisma.user.findUnique({
                    where: { email: data.email },
                });
                if (!user || user.passwordResetCode !== data.code) {
                    return {
                        success: false,
                        message: "Invalid reset code",
                    };
                }
                if ((0, verification_service_1.isCodeExpired)(user.passwordResetCodeExpiry)) {
                    return {
                        success: false,
                        message: "Reset code has expired",
                    };
                }
            }
            else {
                return {
                    success: false,
                    message: "Either token or code with email is required",
                };
            }
            if (!user) {
                return {
                    success: false,
                    message: "Invalid reset token or code",
                };
            }
            const hashedPassword = await bcrypt.hash(data.password, 12);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    passwordResetToken: null,
                    passwordResetTokenExpiry: null,
                    passwordResetCode: null,
                    passwordResetCodeExpiry: null,
                },
            });
            await this.prisma.session.updateMany({
                where: { userId: user.id },
                data: { isActive: false },
            });
            return {
                success: true,
                message: "Password reset successfully",
            };
        }
        catch (error) {
            console.error("Reset password error:", error);
            return {
                success: false,
                message: "Invalid or expired reset token or code",
            };
        }
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verifyRefreshToken(refreshToken);
            const session = await this.prisma.session.findUnique({
                where: {
                    id: payload.sessionId,
                    refreshToken,
                    isActive: true,
                },
                include: {
                    user: true,
                },
            });
            if (!session || new Date() > session.expiresAt) {
                return {
                    success: false,
                    message: "Invalid or expired refresh token",
                };
            }
            const newJwtPayload = {
                userId: session.user.id,
                email: session.user.email,
                role: session.user.role,
                sessionId: session.id,
            };
            const newToken = this.jwtService.generateToken(newJwtPayload);
            const newRefreshToken = this.jwtService.generateRefreshToken(newJwtPayload);
            await this.prisma.session.update({
                where: { id: session.id },
                data: {
                    token: newToken,
                    refreshToken: newRefreshToken,
                },
            });
            const userResponse = {
                id: session.user.id,
                email: session.user.email,
                firstName: session.user.firstName,
                lastName: session.user.lastName,
                role: session.user.role,
                status: session.user.status,
                emailVerified: session.user.emailVerified,
                isOnline: session.user.isOnline,
                lastSeen: session.user.lastSeen,
                createdAt: session.user.createdAt,
                updatedAt: session.user.updatedAt,
            };
            return {
                success: true,
                message: "Token refreshed successfully",
                user: userResponse,
                token: newToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            console.error("Refresh token error:", error);
            return {
                success: false,
                message: "Invalid or expired refresh token",
            };
        }
    }
    async logout(sessionId) {
        try {
            const session = await this.prisma.session.findUnique({
                where: { id: sessionId },
            });
            if (session) {
                await this.prisma.session.update({
                    where: { id: sessionId },
                    data: { isActive: false },
                });
            }
            return {
                success: true,
                message: "Logged out successfully",
            };
        }
        catch (error) {
            console.error("Logout error:", error);
            return {
                success: true,
                message: "Logged out successfully",
            };
        }
    }
    async updateProfile(userId, data) {
        try {
            if (data.email) {
                const existingUser = await this.prisma.user.findFirst({
                    where: {
                        email: data.email,
                        NOT: { id: userId },
                    },
                });
                if (existingUser) {
                    return {
                        success: false,
                        message: "Email is already in use",
                    };
                }
            }
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    isOnline: true,
                    lastSeen: true,
                },
            });
            return {
                success: true,
                message: "Profile updated successfully",
                user: updatedUser,
            };
        }
        catch (error) {
            console.error("Update profile error:", error);
            throw new Error("Failed to update profile");
        }
    }
    async updateOnlineStatus(userId, isOnline) {
        try {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    isOnline,
                    lastSeen: new Date(),
                },
            });
        }
        catch (error) {
            console.error("Update online status error:", error);
        }
    }
    async resendVerificationCode(email) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                };
            }
            if (user.emailVerified) {
                return {
                    success: false,
                    message: "Email is already verified",
                };
            }
            const emailVerificationCode = (0, verification_service_1.generateVerificationCode)();
            const emailVerificationToken = this.jwtService.generateEmailVerificationToken(email);
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerificationCode,
                    emailVerificationCodeExpiry: (0, verification_service_1.getCodeExpiryTime)(),
                    emailVerificationToken,
                    emailVerificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
            });
            await this.emailService.sendEmailVerification(email, emailVerificationToken, user.firstName, emailVerificationCode);
            return {
                success: true,
                message: "New verification code sent to your email",
            };
        }
        catch (error) {
            console.error("Resend verification code error:", error);
            return {
                success: false,
                message: "Failed to send verification code",
            };
        }
    }
    async getUserProfile(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                    isOnline: true,
                    lastSeen: true,
                },
            });
            return user;
        }
        catch (error) {
            console.error("Get user profile error:", error);
            return null;
        }
    }
    async adminResetPassword(adminUserId, targetEmail, newPassword) {
        try {
            const adminUser = await this.prisma.user.findUnique({
                where: { id: adminUserId },
            });
            if (!adminUser || adminUser.role !== "ADMIN") {
                return {
                    success: false,
                    message: "Unauthorized: Admin access required",
                };
            }
            const targetUser = await this.prisma.user.findUnique({
                where: { email: targetEmail },
            });
            if (!targetUser) {
                return {
                    success: false,
                    message: "User not found",
                };
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await this.prisma.user.update({
                where: { id: targetUser.id },
                data: {
                    password: hashedPassword,
                    passwordResetToken: null,
                    passwordResetTokenExpiry: null,
                    passwordResetCode: null,
                    passwordResetCodeExpiry: null,
                },
            });
            await this.prisma.session.updateMany({
                where: { userId: targetUser.id },
                data: { isActive: false },
            });
            console.log(`✅ Admin ${adminUser.email} reset password for user ${targetUser.email}`);
            return {
                success: true,
                message: `Password reset successfully for ${targetUser.email}`,
            };
        }
        catch (error) {
            console.error("Admin reset password error:", error);
            return {
                success: false,
                message: "Failed to reset password",
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_service_1.JWTService !== "undefined" && jwt_service_1.JWTService) === "function" ? _b : Object, typeof (_c = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _c : Object, typeof (_d = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _d : Object])
], AuthService);


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const client_1 = __webpack_require__(14);
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(configService) {
        super({
            log: configService.get("NODE_ENV") === "development"
                ? ["query", "error", "warn"]
                : ["error"],
        });
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            await this.$connect();
            console.log("✅ Database connected successfully");
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            console.log("✅ Database disconnected successfully");
        }
        catch (error) {
            console.error("❌ Database disconnection failed:", error);
            throw error;
        }
    }
    async healthCheck() {
        try {
            await this.user.findFirst();
            return true;
        }
        catch (error) {
            console.error("❌ Database health check failed:", error);
            return false;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], PrismaService);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWTService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const jwt = __webpack_require__(16);
let JWTService = class JWTService {
    constructor(configService) {
        this.configService = configService;
    }
    generateToken(payload) {
        return jwt.sign(payload, this.configService.get("JWT_SECRET"), {
            expiresIn: "15m",
        });
    }
    generateRefreshToken(payload) {
        return jwt.sign(payload, this.configService.get("JWT_REFRESH_SECRET"), {
            expiresIn: "7d",
        });
    }
    verifyToken(token) {
        try {
            if (!token) {
                throw new Error("Token is required");
            }
            return jwt.verify(token, this.configService.get("JWT_SECRET"));
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new Error("Token has expired");
            }
            else if (error.name === "JsonWebTokenError") {
                throw new Error("Invalid token format");
            }
            else if (error.message === "Token is required") {
                throw error;
            }
            else {
                throw new Error("Invalid or expired token");
            }
        }
    }
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.configService.get("JWT_REFRESH_SECRET"));
        }
        catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
    generateEmailVerificationToken(email) {
        return jwt.sign({ email }, this.configService.get("EMAIL_VERIFICATION_SECRET"), {
            expiresIn: "24h",
        });
    }
    verifyEmailVerificationToken(token) {
        try {
            return jwt.verify(token, this.configService.get("EMAIL_VERIFICATION_SECRET"));
        }
        catch (error) {
            throw new Error("Invalid or expired email verification token");
        }
    }
    generatePasswordResetToken(email) {
        return jwt.sign({ email }, this.configService.get("PASSWORD_RESET_SECRET"), {
            expiresIn: "1h",
        });
    }
    verifyPasswordResetToken(token) {
        try {
            return jwt.verify(token, this.configService.get("PASSWORD_RESET_SECRET"));
        }
        catch (error) {
            throw new Error("Invalid or expired password reset token");
        }
    }
};
exports.JWTService = JWTService;
exports.JWTService = JWTService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JWTService);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateVerificationCode = generateVerificationCode;
exports.getCodeExpiryTime = getCodeExpiryTime;
exports.isCodeExpired = isCodeExpired;
exports.isValidCodeFormat = isValidCodeFormat;
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function getCodeExpiryTime() {
    return new Date(Date.now() + 15 * 60 * 1000);
}
function isCodeExpired(expiryDate) {
    if (!expiryDate)
        return true;
    return new Date() > expiryDate;
}
function isValidCodeFormat(code) {
    return /^\d{6}$/.test(code);
}


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const nodemailer = __webpack_require__(19);
let EmailService = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: this.configService.get("SMTP_PORT"),
            secure: this.configService.get("SMTP_PORT") === 465,
            auth: {
                user: this.configService.get("SMTP_USER"),
                pass: this.configService.get("SMTP_PASS"),
            },
        });
    }
    async sendEmailVerification(email, token, firstName, verificationCode) {
        const verificationUrl = `${this.configService.get("FRONTEND_URL")}/verify?token=${token}&type=email`;
        const isCodeBased = !!verificationCode;
        const verificationMethod = isCodeBased
            ? `<div style="text-align: center; margin: 30px 0;">
           <div style="background-color: #f8f9fa; border: 2px solid #EE3638; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
             <h3 style="color: #EE3638; margin: 0 0 10px 0; font-size: 24px;">Your Verification Code</h3>
             <div style="font-size: 32px; font-weight: bold; color: #111111; letter-spacing: 5px; font-family: 'Courier New', monospace;">${verificationCode}</div>
             <p style="color: #666666; font-size: 14px; margin: 10px 0 0 0;">This code expires in 15 minutes</p>
           </div>
         </div>`
            : `<div style="text-align: center; margin: 30px 0;">
           <a href="${verificationUrl}" 
              style="background-color: #EE3638; color: white; padding: 15px 30px; text-decoration: none; 
                     border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
             Verify Email Address
           </a>
         </div>`;
        const alternativeMethod = isCodeBased
            ? `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           Enter this 6-digit code on the verification page to complete your registration.
           If you didn't create an account with Labfry, please ignore this email.
         </p>`
            : `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           If the button doesn't work, you can also copy and paste this link into your browser:<br>
           <a href="${verificationUrl}" style="color: #EE3638; word-break: break-all;">${verificationUrl}</a>
         </p>`;
        const mailOptions = {
            from: `"${this.configService.get("FROM_NAME")}" <${this.configService.get("FROM_EMAIL")}>`,
            to: email,
            subject: "Verify Your Email Address - Labfry",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #EE3638; font-size: 28px; margin-bottom: 10px;">Welcome to Labfry!</h1>
            <p style="color: #666666; font-size: 16px;">Please verify your email address to complete your registration</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-bottom: 15px;">Hi ${firstName},</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up with Labfry! To complete your registration and access all features, 
              ${isCodeBased
                ? "please use the verification code below."
                : "please verify your email address by clicking the button below."}
            </p>
            
            ${verificationMethod}
            
            ${alternativeMethod}
          </div>
          
          <div style="text-align: center; color: #999999; font-size: 12px;">
            <p>${isCodeBased
                ? "This verification code will expire in 15 minutes."
                : "This verification link will expire in 24 hours."}</p>
            <p>If you didn't create an account with Labfry, please ignore this email.</p>
            <p>&copy; 2024 Labfry Technology. All rights reserved.</p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email verification sent to: ${email}`);
            console.log(`📧 Email service: ${this.configService.get("SMTP_HOST")}:${this.configService.get("SMTP_PORT")}`);
            console.log(`📤 From: ${this.configService.get("FROM_EMAIL")}`);
        }
        catch (error) {
            console.error("❌ Failed to send email verification:", error);
            console.error(`📧 SMTP Configuration:`);
            console.error(`   Host: ${this.configService.get("SMTP_HOST")}`);
            console.error(`   Port: ${this.configService.get("SMTP_PORT")}`);
            console.error(`   User: ${this.configService.get("SMTP_USER")}`);
            console.error(`   From: ${this.configService.get("FROM_EMAIL")}`);
            throw new Error("Failed to send verification email");
        }
    }
    async sendPasswordReset(email, token, firstName, resetCode) {
        const resetUrl = `${this.configService.get("FRONTEND_URL")}/reset-password?token=${token}`;
        const isCodeBased = !!resetCode;
        const resetMethod = isCodeBased
            ? `<div style="text-align: center; margin: 30px 0;">
           <div style="background-color: #f8f9fa; border: 2px solid #EE3638; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
             <h3 style="color: #EE3638; margin: 0 0 10px 0; font-size: 24px;">Your Reset Code</h3>
             <div style="font-size: 32px; font-weight: bold; color: #111111; letter-spacing: 5px; font-family: 'Courier New', monospace;">${resetCode}</div>
             <p style="color: #666666; font-size: 14px; margin: 10px 0 0 0;">This code expires in 15 minutes</p>
           </div>
         </div>`
            : `<div style="text-align: center; margin: 30px 0;">
           <a href="${resetUrl}" 
              style="background-color: #EE3638; color: white; padding: 15px 30px; text-decoration: none; 
                     border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
             Reset Password
           </a>
         </div>`;
        const alternativeMethod = isCodeBased
            ? `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           Enter this 6-digit code on the password reset page to create a new password.
           If you didn't request a password reset, please ignore this email.
         </p>`
            : `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           If the button doesn't work, you can also copy and paste this link into your browser:<br>
           <a href="${resetUrl}" style="color: #EE3638; word-break: break-all;">${resetUrl}</a>
         </p>`;
        const mailOptions = {
            from: `"${this.configService.get("FROM_NAME")}" <${this.configService.get("FROM_EMAIL")}>`,
            to: email,
            subject: "Reset Your Password - Labfry",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #EE3638; font-size: 28px; margin-bottom: 10px;">Password Reset Request</h1>
            <p style="color: #666666; font-size: 16px;">We received a request to reset your password</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-bottom: 15px;">Hi ${firstName},</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset the password for your Labfry account. 
              ${isCodeBased
                ? "Please use the reset code below to create a new password."
                : "If you made this request, please click the button below to reset your password."}
            </p>
            
            ${resetMethod}
            
            ${alternativeMethod}
          </div>
          
          <div style="text-align: center; color: #999999; font-size: 12px;">
            <p>${isCodeBased
                ? "This reset code will expire in 15 minutes."
                : "This password reset link will expire in 1 hour."}</p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>&copy; 2024 Labfry Technology. All rights reserved.</p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Password reset email sent to: ${email}`);
            console.log(`📧 Email service: ${this.configService.get("SMTP_HOST")}:${this.configService.get("SMTP_PORT")}`);
            console.log(`📤 From: ${this.configService.get("FROM_EMAIL")}`);
        }
        catch (error) {
            console.error("❌ Failed to send password reset email:", error);
            console.error(`📧 SMTP Configuration:`);
            console.error(`   Host: ${this.configService.get("SMTP_HOST")}`);
            console.error(`   Port: ${this.configService.get("SMTP_PORT")}`);
            console.error(`   User: ${this.configService.get("SMTP_USER")}`);
            console.error(`   From: ${this.configService.get("FROM_EMAIL")}`);
            throw new Error("Failed to send password reset email");
        }
    }
    async sendWelcomeEmail(email, firstName) {
        const mailOptions = {
            from: `"${this.configService.get("FROM_NAME")}" <${this.configService.get("FROM_EMAIL")}>`,
            to: email,
            subject: "Welcome to Labfry - Your Account is Ready!",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #EE3638; font-size: 28px; margin-bottom: 10px;">Welcome to Labfry!</h1>
            <p style="color: #666666; font-size: 16px;">Your account has been successfully verified</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-bottom: 15px;">Hi ${firstName},</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your email has been verified and your Labfry account is now active. 
              You can now access all features and start exploring what we have to offer.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get("FRONTEND_URL")}/login" 
                 style="background-color: #EE3638; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                Login to Your Account
              </a>
            </div>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
          </div>
          
          <div style="text-align: center; color: #999999; font-size: 12px;">
            <p>Thank you for choosing Labfry Technology!</p>
            <p>&copy; 2024 Labfry Technology. All rights reserved.</p>
          </div>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Welcome email sent to: ${email}`);
        }
        catch (error) {
            console.error("❌ Failed to send welcome email:", error);
        }
    }
    async testConnection() {
        try {
            await this.transporter.verify();
            console.log("✅ Email service connection verified");
            return true;
        }
        catch (error) {
            console.error("❌ Email service connection failed:", error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailService);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminResetPasswordDto = exports.OnlineStatusDto = exports.ResendVerificationDto = exports.UpdateProfileDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.VerifyEmailDto = exports.LoginDto = exports.RegisterDto = void 0;
exports.IsPasswordMatch = IsPasswordMatch;
const class_validator_1 = __webpack_require__(21);
const class_transformer_1 = __webpack_require__(22);
const swagger_1 = __webpack_require__(3);
function IsPasswordMatch(property, validationOptions) {
    return (0, class_validator_1.ValidateBy)({
        name: "isPasswordMatch",
        constraints: [property],
        validator: {
            validate(value, args) {
                const [relatedPropertyName] = args.constraints;
                const relatedValue = args.object[relatedPropertyName];
                return value === relatedValue;
            },
            defaultMessage(args) {
                const [relatedPropertyName] = args.constraints;
                return `${args.property} must match ${relatedPropertyName}`;
            },
        },
    }, validationOptions);
}
class RegisterDto {
    constructor() {
        this.role = "USER";
    }
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "john.doe@labfry.com",
        description: "User email address",
    }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "SecurePass123!",
        description: "User password",
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "SecurePass123!",
        description: "Confirm password - must match password",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: "Confirm password must be at least 8 characters" }),
    IsPasswordMatch("password", { message: "Passwords do not match" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John", description: "User first name" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "First name is required" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: "First name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Doe", description: "User last name" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "Last name is required" }),
    (0, class_validator_1.Matches)(/^[a-zA-Z\s'-]+$/, {
        message: "Last name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "USER",
        description: "User role",
        enum: ["ADMIN", "USER", "CUSTOMER"],
        default: "USER",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => value?.toUpperCase()),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class LoginDto {
    constructor() {
        this.rememberMe = false;
    }
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "john.doe@labfry.com",
        description: "User email address",
    }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "SecurePass123!", description: "User password" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "Password is required" }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false, description: "Remember me option" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LoginDto.prototype, "rememberMe", void 0);
class VerifyEmailDto {
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Verification token",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "Verification token is required" }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "123456",
        description: "6-digit verification code",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: "Verification code must be 6 digits" }),
    (0, class_validator_1.Matches)(/^\d{6}$/, {
        message: "Verification code must contain only numbers",
    }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "john.doe@labfry.com",
        description: "Email address for code verification",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: "Valid email is required" }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "email", void 0);
class ForgotPasswordDto {
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "john.doe@labfry.com",
        description: "User email address",
    }),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Password reset token",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "Reset token is required" }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "654321", description: "6-digit reset code" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: "Reset code must be 6 digits" }),
    (0, class_validator_1.Matches)(/^\d{6}$/, { message: "Reset code must contain only numbers" }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "john.doe@labfry.com",
        description: "Email address for code reset",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: "Valid email is required" }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "NewSecurePass123!",
        description: "New password",
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters" }),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "John", description: "User first name" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "First name is required" }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Doe", description: "User last name" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1, { message: "Last name is required" }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "john.doe@labfry.com",
        description: "User email address",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: "Invalid email address" }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
class ResendVerificationDto {
}
exports.ResendVerificationDto = ResendVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "john.doe@labfry.com",
        description: "User email address",
    }),
    (0, class_validator_1.IsEmail)({}, { message: "Valid email is required" }),
    __metadata("design:type", String)
], ResendVerificationDto.prototype, "email", void 0);
class OnlineStatusDto {
}
exports.OnlineStatusDto = OnlineStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Online status" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], OnlineStatusDto.prototype, "isOnline", void 0);
class AdminResetPasswordDto {
}
exports.AdminResetPasswordDto = AdminResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "user@labfry.com",
        description: "Target user email address",
    }),
    (0, class_validator_1.IsEmail)({}, { message: "Please enter a valid email address" }),
    __metadata("design:type", String)
], AdminResetPasswordDto.prototype, "targetEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "NewSecurePass123!",
        description: "New password for the user",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters long" }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
    __metadata("design:type", String)
], AdminResetPasswordDto.prototype, "newPassword", void 0);


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RateLimitResponseDto = exports.ErrorResponseDto = exports.AuthResponseDto = exports.UserResponseDto = void 0;
const swagger_1 = __webpack_require__(3);
class UserResponseDto {
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "507f1f77bcf86cd799439011", description: "User ID" }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "john.doe@labfry.com",
        description: "User email address",
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "John", description: "User first name" }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Doe", description: "User last name" }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "USER",
        description: "User role",
        enum: ["ADMIN", "USER", "CUSTOMER"],
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "ACTIVE",
        description: "User status",
        enum: ["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED", "DELETED"],
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Email verification status" }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "emailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Online status" }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "2024-01-15T10:30:00.000Z",
        description: "Last seen timestamp",
    }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], UserResponseDto.prototype, "lastSeen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2024-01-01T00:00:00.000Z",
        description: "Account creation timestamp",
    }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2024-01-15T10:30:00.000Z",
        description: "Last update timestamp",
    }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], UserResponseDto.prototype, "updatedAt", void 0);
class AuthResponseDto {
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: "Success status" }),
    __metadata("design:type", Boolean)
], AuthResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Login successful", description: "Response message" }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: UserResponseDto,
        description: "User information",
    }),
    __metadata("design:type", UserResponseDto)
], AuthResponseDto.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT access token",
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "JWT refresh token",
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
class ErrorResponseDto {
}
exports.ErrorResponseDto = ErrorResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: "Success status" }),
    __metadata("design:type", Boolean)
], ErrorResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Invalid email or password",
        description: "Error message",
    }),
    __metadata("design:type", String)
], ErrorResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400, description: "HTTP status code" }),
    __metadata("design:type", Number)
], ErrorResponseDto.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: ["Email must be a valid email address"],
        description: "Validation errors",
    }),
    __metadata("design:type", Array)
], ErrorResponseDto.prototype, "errors", void 0);
class RateLimitResponseDto {
}
exports.RateLimitResponseDto = RateLimitResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: "Success status" }),
    __metadata("design:type", Boolean)
], RateLimitResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Too many requests. Please try again in 1 minute.",
        description: "Rate limit message",
    }),
    __metadata("design:type", String)
], RateLimitResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 60, description: "Retry after seconds" }),
    __metadata("design:type", Number)
], RateLimitResponseDto.prototype, "retryAfter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 60000, description: "Retry after milliseconds" }),
    __metadata("design:type", Number)
], RateLimitResponseDto.prototype, "retryAfterMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2024-01-15T10:30:00.000Z",
        description: "Timestamp of rate limit",
    }),
    __metadata("design:type", String)
], RateLimitResponseDto.prototype, "timestamp", void 0);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthModule = void 0;
const common_1 = __webpack_require__(2);
const health_controller_1 = __webpack_require__(25);
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, common_1.Module)({
        controllers: [health_controller_1.HealthController],
    })
], HealthModule);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HealthController = void 0;
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
let HealthController = class HealthController {
    check() {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            service: "Labfry NestJS Backend",
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Health check endpoint" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service is healthy" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)("Health"),
    (0, common_1.Controller)("health")
], HealthController);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketModule = void 0;
const common_1 = __webpack_require__(2);
const socket_gateway_1 = __webpack_require__(27);
const auth_module_1 = __webpack_require__(7);
const jwt_service_1 = __webpack_require__(15);
let WebSocketModule = class WebSocketModule {
};
exports.WebSocketModule = WebSocketModule;
exports.WebSocketModule = WebSocketModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        providers: [socket_gateway_1.SocketGateway, jwt_service_1.JWTService],
        exports: [socket_gateway_1.SocketGateway],
    })
], WebSocketModule);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketGateway = void 0;
const websockets_1 = __webpack_require__(28);
const common_1 = __webpack_require__(2);
const config_1 = __webpack_require__(5);
const socket_io_1 = __webpack_require__(29);
const jwt_service_1 = __webpack_require__(15);
const auth_service_1 = __webpack_require__(10);
let SocketGateway = class SocketGateway {
    constructor(jwtService, authService, configService) {
        this.jwtService = jwtService;
        this.authService = authService;
        this.configService = configService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        console.log(`🔌 New socket connection: ${client.id}`);
        setTimeout(() => {
            const user = this.connectedUsers.get(client.id);
            if (!user && client.connected) {
                console.log(`⏰ Disconnecting unauthenticated client: ${client.id}`);
                client.emit("auth_timeout", {
                    message: "Authentication timeout - please authenticate within 30 seconds",
                });
                client.disconnect();
            }
        }, 30000);
    }
    async handleDisconnect(client) {
        const user = this.connectedUsers.get(client.id);
        if (user) {
            try {
                await this.authService.updateOnlineStatus(user.userId, false);
                const offlineUpdate = {
                    userId: user.userId,
                    isOnline: false,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
                client.broadcast.emit("user_offline", offlineUpdate);
                this.connectedUsers.delete(client.id);
                console.log(`🔌 User disconnected: ${user.firstName} ${user.lastName} (${user.userId})`);
            }
            catch (error) {
                console.error("Error handling disconnect:", error);
            }
        }
        console.log(`🔌 Socket disconnected: ${client.id}`);
    }
    async handleAuthenticate(client, data) {
        try {
            if (!data || !data.token) {
                client.emit("auth_error", { message: "Token is required" });
                return;
            }
            const payload = this.jwtService.verifyToken(data.token);
            const user = await this.authService.getUserProfile(payload.userId);
            if (!user) {
                client.emit("auth_error", { message: "User not found" });
                return;
            }
            const socketUser = {
                userId: user.id,
                socketId: client.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                joinedAt: new Date(),
            };
            this.connectedUsers.set(client.id, socketUser);
            await this.authService.updateOnlineStatus(user.id, true);
            client.join(user.id);
            const onlineUpdate = {
                userId: user.id,
                isOnline: true,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            client.broadcast.emit("user_online", onlineUpdate);
            client.emit("authenticated", {
                success: true,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isOnline: true,
                },
            });
            console.log(`✅ User authenticated: ${user.firstName} ${user.lastName} (${user.id})`);
        }
        catch (error) {
            console.error("Socket authentication error:", error.message);
            client.emit("auth_error", { message: "Authentication failed" });
        }
    }
    async handleUpdateOnlineStatus(client, data) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit("auth_error", { message: "Please authenticate first" });
            return;
        }
        try {
            await this.authService.updateOnlineStatus(user.userId, data.isOnline);
            const statusUpdate = {
                userId: user.userId,
                isOnline: data.isOnline,
                firstName: user.firstName,
                lastName: user.lastName,
            };
            client.broadcast.emit("user_status_changed", statusUpdate);
            client.emit("status_updated", {
                success: true,
                isOnline: data.isOnline,
                message: data.isOnline ? "You are now online" : "You are now offline",
            });
            console.log(`📡 Status updated: ${user.firstName} ${user.lastName} is now ${data.isOnline ? "online" : "offline"}`);
        }
        catch (error) {
            console.error("Error updating online status:", error);
            client.emit("error", { message: "Failed to update status" });
        }
    }
    handleGetOnlineUsers(client) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit("auth_error", { message: "Please authenticate first" });
            return;
        }
        const onlineUsers = Array.from(this.connectedUsers.values()).map((user) => ({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            joinedAt: user.joinedAt,
        }));
        client.emit("online_users_list", { users: onlineUsers });
    }
    handleTypingStart(client, data) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit("auth_error", { message: "Please authenticate first" });
            return;
        }
        const typingData = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        if (data.targetUserId) {
            client.to(data.targetUserId).emit("user_typing_start", typingData);
        }
        else {
            client.broadcast.emit("user_typing_start", typingData);
        }
    }
    handleTypingStop(client, data) {
        const user = this.connectedUsers.get(client.id);
        if (!user) {
            client.emit("auth_error", { message: "Please authenticate first" });
            return;
        }
        const typingData = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        if (data.targetUserId) {
            client.to(data.targetUserId).emit("user_typing_stop", typingData);
        }
        else {
            client.broadcast.emit("user_typing_stop", typingData);
        }
    }
    sendToUser(userId, event, data) {
        this.server.to(userId).emit(event, data);
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    getOnlineUsersCount() {
        return this.connectedUsers.size;
    }
    getOnlineUsers() {
        return Array.from(this.connectedUsers.values());
    }
    isUserOnline(userId) {
        return Array.from(this.connectedUsers.values()).some((user) => user.userId === userId);
    }
    disconnectUser(userId) {
        const userSocket = Array.from(this.connectedUsers.entries()).find(([_, user]) => user.userId === userId);
        if (userSocket) {
            const [socketId] = userSocket;
            this.server.sockets.sockets.get(socketId)?.disconnect();
        }
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_d = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _d : Object)
], SocketGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("authenticate"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleAuthenticate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("update_online_status"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleUpdateOnlineStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("get_online_users"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleGetOnlineUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("typing_start"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("typing_stop"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _l : Object, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleTypingStop", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: [
                process.env.FRONTEND_URL || "http://localhost:3001",
                process.env.FRONTEND_URL_NGINX || "http://localhost:3000",
                process.env.FRONTEND_URL_PRODUCTION || "https://labfry.pino7.com",
                process.env.FRONTEND_URL_SERVER || "http://93.127.199.59:3001",
                process.env.FRONTEND_URL_SERVER_NGINX || "http://93.127.199.59:3000",
                "http://localhost:3000",
                "http://localhost:3001",
                "http://93.127.199.59:3000",
                "http://93.127.199.59:3001",
                "https://labfry.pino7.com",
                "https://www.labfry.pino7.com",
                /localhost:\d+$/,
                /.*\.pino7\.com$/
            ],
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: [
                "Content-Type",
                "Authorization",
                "Cookie",
                "X-Requested-With",
                "Accept",
                "Origin"
            ]
        },
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_service_1.JWTService !== "undefined" && jwt_service_1.JWTService) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object])
], SocketGateway);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 29 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThrottlerExceptionFilter = void 0;
const common_1 = __webpack_require__(2);
const throttler_1 = __webpack_require__(6);
let ThrottlerExceptionFilter = class ThrottlerExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const path = request.url;
        let message = "Too many requests. Please try again in 1 minute.";
        let retryAfter = 60;
        if (path.includes("/auth/login")) {
            message = "Too many login attempts. Please try again in 1 minute.";
            retryAfter = 60;
        }
        else if (path.includes("/auth/register")) {
            message =
                "Too many registration attempts. Please try again in 5 minutes.";
            retryAfter = 300;
        }
        else if (path.includes("/auth/forgot-password") ||
            path.includes("/auth/resend-verification")) {
            message = "Too many email requests. Please try again in 5 minutes.";
            retryAfter = 300;
        }
        else if (path.includes("/auth/verify-email") ||
            path.includes("/auth/reset-password")) {
            message = "Too many verification attempts. Please try again in 1 minute.";
            retryAfter = 60;
        }
        response
            .status(common_1.HttpStatus.TOO_MANY_REQUESTS)
            .setHeader("Retry-After", retryAfter)
            .json({
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
            message,
            error: "Too Many Requests",
            retryAfter,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
};
exports.ThrottlerExceptionFilter = ThrottlerExceptionFilter;
exports.ThrottlerExceptionFilter = ThrottlerExceptionFilter = __decorate([
    (0, common_1.Catch)(throttler_1.ThrottlerException)
], ThrottlerExceptionFilter);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const cookieParser = __webpack_require__(30);
const throttler_exception_filter_1 = __webpack_require__(31);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new throttler_exception_filter_1.ThrottlerExceptionFilter());
    const frontendUrls = [
        process.env.FRONTEND_URL || "http://localhost:3001",
        process.env.FRONTEND_URL_NGINX || "http://localhost:3000",
        process.env.FRONTEND_URL_PRODUCTION || "https://labfry.pino7.com",
        process.env.FRONTEND_URL_SERVER || "http://93.127.199.59:3001",
        process.env.FRONTEND_URL_SERVER_NGINX || "http://93.127.199.59:3000",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://93.127.199.59:3000",
        "http://93.127.199.59:3001",
        "https://labfry.pino7.com",
        "https://www.labfry.pino7.com"
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            console.log('🌐 CORS Origin Request:', origin);
            if (frontendUrls.indexOf(origin) !== -1) {
                return callback(null, true);
            }
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
            if (origin.includes('.pino7.com')) {
                return callback(null, true);
            }
            if (origin === 'https://labfry.pino7.com' || origin === 'https://www.labfry.pino7.com') {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'), false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cookie",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ],
        exposedHeaders: ["Set-Cookie"],
        optionsSuccessStatus: 200,
        preflightContinue: false
    });
    app.use(cookieParser());
    app.setGlobalPrefix("api");
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Labfry API")
        .setDescription(`
      🚀 **Labfry Backend API** - A comprehensive authentication and user management system
      
      ## Features
      - 🔐 **JWT Authentication** with refresh tokens
      - 📧 **Email Verification** with 6-digit codes  
      - 🔒 **Password Reset** with secure codes
      - 👥 **Role-based Access Control** (Admin, User, Customer)
      - ⚡ **Real-time Communication** with WebSocket
      - 🛡️ **Rate Limiting** and security features
      - 📝 **Comprehensive API Documentation**
      
      ## Authentication Flow
      1. **Register** → Email verification required
      2. **Login** → JWT tokens with session management
      3. **Access Protected Routes** → Bearer token authentication
      4. **Password Reset** → Email-based secure reset flow
      
      ## Rate Limiting
      - **Login**: 3 attempts per minute
      - **Registration**: 2 attempts per 5 minutes  
      - **Email Services**: 2 requests per 5 minutes
      - **Password Reset**: 5 attempts per minute
      
      ## Security Features
      - Bcrypt password hashing
      - JWT token expiration
      - Rate limiting protection
      - Input validation and sanitization
      - Role-based authorization
    `)
        .setVersion("1.0.0")
        .setContact("Labfry Technology", "https://labfry.com", "support@labfry.com")
        .setLicense("MIT", "https://opensource.org/licenses/MIT")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "Authorization",
        description: "Enter JWT token",
        in: "header",
    }, "JWT-auth")
        .addCookieAuth("refreshToken", {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description: "Refresh token stored in HTTP-only cookie",
    })
        .addTag("Authentication", "User registration, login, and authentication")
        .addTag("User Management", "User profile and account management")
        .addTag("Email Services", "Email verification and password reset")
        .addTag("Admin", "Administrative functions and user management")
        .addTag("Health", "System health and monitoring endpoints")
        .addServer("http://localhost:5000", "Development server")
        .addServer("https://api.labfry.com", "Production server")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api/docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: "alpha",
            operationsSorter: "alpha",
            docExpansion: "none",
            filter: true,
            showRequestDuration: true,
        },
        customSiteTitle: "Labfry API Documentation",
        customfavIcon: "/favicon.ico",
        customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #EE3638; }
    `,
    });
    const port = configService.get("PORT") || 5000;
    await app.listen(port);
    console.log("🚀 Labfry NestJS Backend Started");
    console.log(`📍 Server: http://localhost:${port}`);
    console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
    console.log(`🔍 Health Check: http://localhost:${port}/api/health`);
}
bootstrap();

})();

/******/ })()
;