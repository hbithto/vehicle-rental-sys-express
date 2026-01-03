import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { sendSuccessResponse, sendErrorResponse } from '~/utils/sendResponse';
import { UserService } from './user.service';

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserService.getAllUsers();
    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Users retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user as any;

    if (currentUser.role !== 'admin' && String(currentUser.id) !== userId) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: 'You are not authorized to update this profile',
      });
    }

    // prevent non-admin from updating role
    if (currentUser.role !== 'admin' && req.body.role) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.FORBIDDEN,
        message: 'You are not authorized to update role',
      });
    }

    const result = await UserService.updateUser(userId as string, req.body);

    if (!result) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: 'Failed to update user',
      });
    }

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const result = await UserService.deleteUser(userId as string);

    if (!result) {
      return sendErrorResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    sendSuccessResponse(res, {
      statusCode: httpStatus.OK,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
