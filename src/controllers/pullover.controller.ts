import { Pullover, PulloversResponse } from "abipulli-types";
import { Request, Response, NextFunction } from "express";
import { fetchAllPullovers } from "src/services/pullovers/fetchPullovers";

export const getAllPulloversController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const castedPullovers: Pullover[] = await fetchAllPullovers();
    const pulloversResponse: PulloversResponse = {
      success: true,
      data: {
        items: castedPullovers,
        page: 1,
        pageSize: castedPullovers.length,
        total: castedPullovers.length,
      },
    };
    res.status(200).send(pulloversResponse);
  } catch (error) {
    next(error);
  }
};
