import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop
} from "@typegoose/typegoose";

import mongoose from "mongoose";

export const CARD_ATTACHMENT_TYPES = {
  IMAGE: "image",
  LINK: "link"
};

export interface CardAttachment {
  type: string;
  title?: string,
  url?: string,
}

@post<CardClass>("save", function (doc) {
  if (doc) {
    doc.id = doc._id.toString();
    doc._id = doc.id;
  }
})
@post<CardClass[]>(/^find/, function (docs) {
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
    strict: false,
    timestamps: true,
    collection: "cards"
  },
  options: {
    allowMixed: Severity.ALLOW,
    disableCaching: true
  }
})
@index({ title: 1 })
class CardClass {
  @prop({ required: true })
  title: string;

  @prop()
  sideB: string;

  @prop({ required: true })
  userID: mongoose.Types.ObjectId | string;

  @prop({ default: [] })
  attachments: Array<CardAttachment>;

  _id: mongoose.Types.ObjectId | string;

  id: string;
}

let Card = mongoose?.models?.CardClass;

if (!Card) {
  try {
    Card = getModelForClass(CardClass);
  } catch (e) {
    //console.log(e)
  }
}

export { Card, CardClass };
