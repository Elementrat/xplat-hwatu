import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop
} from "@typegoose/typegoose";

import mongoose from "mongoose";

export enum CARD_PROGRESS {
  NEGATIVE = 0,
  OK = 1,
  POSITIVE = 2
}

@post<UserProfileClass>("save", function (doc) {
  if (doc) {
    doc.id = doc._id.toString();
    doc._id = doc.id;
  }
})
@post<UserProfileClass[]>(/^find/, function (docs) {
  // @ts-ignore
  if (this.op === "find") {
    docs.forEach((doc) => {
      doc.id = doc._id.toString();
      doc._id = doc.id;
    });
  }
})
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: "user-profiles"
  },
  options: {
    allowMixed: Severity.ALLOW,
    disableCaching: true
  }
})
@index({ title: 1 })
class UserProfileClass {
  @prop({ required: true, default: [] })
  cardProgress: Map<mongoose.Types.ObjectId, CARD_PROGRESS>;

  @prop({ required: true })
  userID: mongoose.Types.ObjectId | string;

  _id: mongoose.Types.ObjectId | string;
  id: string;
}

let UserProfile = mongoose?.models?.UserProfileClass;

if (!UserProfile) {
  try {
    UserProfile = getModelForClass(UserProfileClass);
  } catch (e) {
    //console.log(e)
  }
}

export { UserProfile, UserProfileClass };
