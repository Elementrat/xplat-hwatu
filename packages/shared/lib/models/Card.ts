import {
    ModelOptions,
    Severity,
    getModelForClass,
    index,
    post,
    prop,
    setGlobalOptions,
  } from "@typegoose/typegoose";

  import mongoose from "mongoose";

  // setGlobalOptions({ globalOptions: { disableGlobalCaching: true } }); // does not affect the previous setting of "options"
  
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
      timestamps: true,
      collection: "cards",
    },
    options: {
      allowMixed: Severity.ALLOW,
      disableCaching: true
    },
  })
  
  @index({ title: 1 })
  class CardClass {
    @prop({ required: true, unique: true })
    title: string;
  
    @prop({ default: false })
    completed: boolean;
  
    _id: mongoose.Types.ObjectId | string;
  
    id: string;
  }
  
let Card = mongoose?.models?.CardClass;

if (!Card){
  try{
   Card = getModelForClass(CardClass);
  }
  catch (e){
    //console.log(e)
  }
}


export { Card, CardClass };
  