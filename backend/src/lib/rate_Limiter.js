import { Rate_limits } from "./config";
import {Ratelimit} from "@upstash/ratelimit"
import redis from "./redis";

export const GeneralLimiter=new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(
        Rate_limits.general.requests,
        Rate_limits.general.window
    ),
    analytics:true,
})

export const AuthLimiter=new Ratelimit({
    redis,
    limiter:Ratelimit.slidingWindow(
        Rate_limits.auth.requests,
        Rate_limits.auth.window
    ),
    analytics:true,
})