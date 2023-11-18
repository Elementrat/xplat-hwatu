import {
  ModelOptions,
  Severity,
  getModelForClass,
  index,
  post,
  prop
} from "@typegoose/typegoose";

import mongoose from "mongoose";

@post<TagClass>("save", function (doc) {
  if (doc) {
    doc.id = doc._id.toString();
    doc._id = doc.id;
  }
})
@post<TagClass[]>(/^find/, function (docs) {
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
    collection: "tags"
  },
  options: {
    allowMixed: Severity.ALLOW,
    disableCaching: true
  }
})
@index({ title: 1 })
class TagClass {
  @prop({ required: true })
  title: string;

  @prop({ required: true, default: [] })
  cards: Array<mongoose.Types.ObjectId> | Array<string>;

  @prop({ required: true })
  userID: mongoose.Types.ObjectId | string;

  @prop({ required: true, default: "rgba(0,0,0,.2)" })
  color: string;

  _id: mongoose.Types.ObjectId | string;

  id: string;
}

let Tag = mongoose?.models?.TagClass;

if (!Tag) {
  try {
    Tag = getModelForClass(TagClass);
  } catch (e) {
    //console.log(e)
  }
}

export { Tag, TagClass };
