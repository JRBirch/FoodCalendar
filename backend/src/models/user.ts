import { Schema, model, isValidObjectId, HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  password: string;
  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserDoc = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
  name: { type: String, required: [true, "Please provide name of food"] },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

/**
 * Before saving the password hash it so that it is
 * not exposed in the db.
 */
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Check whether the Id is valid
 * @param id The id to be checked
 * @returns boolean indicating whether the id is valid
 */
const isValidId = (id: string): boolean => {
  return isValidObjectId(id);
};

/**
 * Create the JSON web token.
 * @returns string
 */
userSchema.methods.createJWT = function (): string {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

/**
 * Check whether the password is a match or not
 * @param candidatePassword The password be authenticated
 * @returns boolean indicating whether the password is a match
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = model<IUser>("User", userSchema);

export { IUser, User, UserDoc, isValidId };
