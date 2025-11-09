import { Types } from "mongoose";

export type JWTPayloadType = {
  userId: Types.ObjectId;
};
