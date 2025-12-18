"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_routes_1 = require("../modules/User/user.routes");
const auth_route_1 = require("../modules/auths/auth.route");
const division_router_1 = require("../modules/division/division.router");
const tour_router_1 = require("../modules/tour/tour.router");
const booking_routes_1 = require("../modules/booking/booking.routes");
const payment_route_1 = require("../modules/payments/payment.route");
const otp_routes_1 = require("../modules/otp/otp.routes");
const stats_routes_1 = require("../modules/stats/stats.routes");
exports.router = (0, express_1.Router)();
const modeuleRoute = [
    {
        path: "/user",
        route: user_routes_1.userRouter
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute
    },
    {
        path: "/division",
        route: division_router_1.DivisionRouter
    }, {
        path: "/tour",
        route: tour_router_1.TourRouter
    }, {
        path: "/booking",
        route: booking_routes_1.bookingRouter
    }, {
        path: "/payment",
        route: payment_route_1.paymentRoute
    }, {
        path: "/otp",
        route: otp_routes_1.OtpRouter
    }, {
        path: "/stats",
        route: stats_routes_1.StatsRoutes
    }
];
modeuleRoute.forEach((route) => {
    exports.router.use(route.path, route.route);
});
