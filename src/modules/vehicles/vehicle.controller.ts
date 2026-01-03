import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse, sendErrorResponse } from '~/utils/sendResponse';
import { VehicleService } from './vehicle.service';

const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await VehicleService.createVehicle(req.body);
    sendSuccessResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Vehicle created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await VehicleService.getAllVehicles();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: result.length > 0 ? 'Vehicles retrieved successfully' : 'No vehicles found',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleId } = req.params;
    const result = await VehicleService.getVehicleById(vehicleId as string);

    if (!result) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Vehicle retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleId } = req.params;
    const result = await VehicleService.updateVehicle(vehicleId as string, req.body);

    if (!result) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Vehicle not found or no changes made',
      });
    }

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Vehicle updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vehicleId } = req.params;
    const result = await VehicleService.deleteVehicle(vehicleId as string);

    if (!result) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Vehicle not found',
      });
    }

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Vehicle deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
