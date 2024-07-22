

import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log("Token received:", token); // Log token for debugging

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        console.log("Decoded token:", decodedToken); // Log decoded token for debugging

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error); // Log error for debugging
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});




// import { ApiError } from "../utils/ApiErrors.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken"
// import { User } from "../models/user.model.js";

// // for following in : (req,res,next) ,we are not using " res " so put it " _ ", which you will often watch in production level application...
// export const  verifyJWT = asyncHandler(async (req, _, next)=>{
//     try {
//         const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
//         if(!token){
//             throw new ApiError(401, "Unauthorized request")
//         }
    
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
//         if(!user){
            
//             throw new ApiError(401, "Invalid Acess Token")
//         }
    
//         req.user = user
//         next()
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }

// })