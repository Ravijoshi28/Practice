import jwt from "jsonwebtoken"

export function GenerateToken(data){
    const user=data.id;
    const email=data.email;
    const token=jwt.sign({user,email},
        process.env.JWT_SECRET_ACCESS,{
            expiresIn:'20m'
        }
    )
    return token;
}

export function GenerateRefreshToken(data){
    const user=data.id;
    const email=data.email;
    const token=jwt.sign({user,email},
        process.env.JWT_SECRET_REFRESH,{
            expiresIn:'7d'
        }
    )
    return token;
}