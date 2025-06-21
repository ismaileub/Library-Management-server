"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
//pre hooks
bookSchema.pre("save", function (next) {
    if (this.copies === 0) {
        this.available = false;
    }
    next();
});
bookSchema.pre("findOneAndUpdate", function (next) {
    var _a, _b;
    const update = this.getUpdate();
    const copies = (_a = update === null || update === void 0 ? void 0 : update.copies) !== null && _a !== void 0 ? _a : (_b = update === null || update === void 0 ? void 0 : update.$set) === null || _b === void 0 ? void 0 : _b.copies;
    if (typeof copies === "number") {
        if (update.$set) {
            update.$set.available = copies === 0 ? false : true;
        }
        else {
            update.available = copies === 0 ? false : true;
        }
        this.setUpdate(update);
    }
    next();
});
//
bookSchema.statics.BorrowStaticMethod = function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
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
        yield book.save();
    });
};
exports.Book = mongoose_1.default.model("Book", bookSchema);
// export const Book = model("Book", bookSchema);
