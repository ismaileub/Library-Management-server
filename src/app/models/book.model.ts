import mongoose, { Model, Schema, model } from "mongoose";
import { Query } from "mongoose";
import { BookModel, IBook } from "../interfaces/book.interfaces";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "Invalid genre provided",
      },
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: [true, "ISBN should be unique. Got duplicate ISBN"],
    },
    description: {
      type: String,
      default: "",
    },
    copies: {
      type: Number,
      required: [true, "Copies are required"],
      min: [0, "Copies cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Copies must be an integer",
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//pre hooks
bookSchema.pre("save", function (next) {
  if (this.copies === 0) {
    this.available = false;
  }
  next();
});

bookSchema.pre(
  "findOneAndUpdate",
  function (this: Query<any, any>, next: (err?: Error) => void) {
    const update = this.getUpdate() as any;

    const copies = update?.copies ?? update?.$set?.copies;

    if (typeof copies === "number") {
      if (update.$set) {
        update.$set.available = copies === 0 ? false : true;
      } else {
        update.available = copies === 0 ? false : true;
      }
      this.setUpdate(update);
    }

    next();
  }
);

// ✅ Static method
bookSchema.statics.BorrowStaticMethod = async function (
  bookId: string,
  quantity: number
) {
  const book = await this.findById(bookId);
  if (!book) {
    throw new Error("Book not found");
  }

  if (book.copies < quantity) {
    throw new Error("Not enough copies available");
  }

  book.copies -= quantity;
  if (book.copies === 0) {
    book.available = false;
  }

  await book.save();
};

export const Book = mongoose.model<IBook, BookModel>("Book", bookSchema);

// export const Book = model("Book", bookSchema);
