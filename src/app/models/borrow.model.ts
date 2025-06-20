import { Schema, model, Types } from "mongoose";

const borrowSchema = new Schema(
  {
    book: {
      type: Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "At least one copy must be borrowed."],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer.",
      },
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Due date must be in the future.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Borrow = model("Borrow", borrowSchema);
