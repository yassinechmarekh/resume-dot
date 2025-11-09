import { Types } from "mongoose";
import { IUser, User } from "../models/User.model";

export const getUserByIdService = async (
  userId: Types.ObjectId,
  selectFields?: string
): Promise<IUser> => {
  const user = await User.findById(userId).select(selectFields || '');

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const updateUserService = async (
  userId: Types.ObjectId,
  updatedData: Partial<IUser>
): Promise<IUser> => {
  const user = await getUserByIdService(userId);

  if (!updatedData || Object.keys(updatedData).length === 0) {
    throw new Error("No data provided for update.");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });

  if (!updatedUser) {
    throw new Error(`Unable to edit ${user.username}'s information`);
  }

  return updatedUser;
};
