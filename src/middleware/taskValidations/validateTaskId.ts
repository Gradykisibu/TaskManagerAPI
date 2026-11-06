import { Response, Request, NextFunction } from "express";

export function validateTaskId(req:Request, res:Response, next:NextFunction){

    const id = Number(req.params.id)

    if(id <= 0 || !Number.isInteger(id)){
        res
        .status(400)
        .json({
            success:false,
            message:"invalid ID format."
        })

        return;
    };

    next()
}