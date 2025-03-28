const mongoose = require("mongoose");

const validator = require("validator");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide the item name!"],
        trim: true,
    },
    shortDescription: {
        type: String,
        required: [true, "Please provide a short description!"],
        trim: true,
    },
    detailedDescription: {
        type: String,
        required: [true, "Please provide a detailed description!"],
        trim: true,
    },
    startingPrice: {
        type: Number,
        required: [true, "Please provide the starting price!"],
    },
    biddingStartTime: {
        type: Date,
        required: [true, "Please provide the bidding start time!"],
    },
    biddingEndTime: {
        type: Date,
        required: [true, "Please provide the bidding end time!"],
    },
    condition: {
        type: String,
        required: [true, "Please specify the item's condition!"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Please specify the item's category!"],
        trim: true,
    },
    pickupLocation: {
        type: String,
        required: [true, "Please provide the pickup location!"],
        trim: true,
    },
    images: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.every((url) => validator.isURL(url));
            },
            message: "Each image must be a valid URL.",
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

itemSchema.pre(/^find/, function (next) {
    this.find();
    next();
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;