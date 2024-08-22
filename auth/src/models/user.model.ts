import mongoose from "mongoose";
import { Password } from "../services/password";

// Attrs required to create a new user.
export interface UserAttrs {
  email: string;
  password: string;
}

// A UserDoc interface that describes the properties that a User Document has.
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

//A custom static method build(attrs: UserAttrs), which takes the attributes needed to create a user and returns a UserDoc.
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

userSchema.pre("save", async function (done) {
  console.log("Pre save hook");

  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
