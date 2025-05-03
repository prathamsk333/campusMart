const Item = require("../models/itemsModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });


// Get all items
exports.getAllItems = catchAsync(async (req, res, next) => {
  console.log("hello");
  const items = await Item.find();
  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      items,
    },
  });
});

// Get a single item by ID
exports.getItemById = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      item,
    },
  });
});

const randomImageName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

// Create a new item
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!accessKey || !secretAccessKey) {
  throw new Error("AWS credentials are not defined");
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: process.env.AWS_REGION,
});

exports.createItem = catchAsync(async (req, res) => {
  console.log("heyyyyyyyyyyyyyyyyyyyya");
  console.log(req.body);
  const imageName = randomImageName();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: imageName,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype,
  };
  console.log(params)

  const command = new PutObjectCommand(params);
  await s3.send(command);

  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
  req.body.image = imageUrl;

  const newItem = await Item.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      item: newItem,
    },
  });
});

// Update an item by IDl
exports.updateItem = catchAsync(async (req, res, next) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedItem) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      item: updatedItem,
    },
  });
});

// Delete an item by ID
exports.deleteItem = catchAsync(async (req, res, next) => {
  const deletedItem = await Item.findByIdAndDelete(req.params.id);

  if (!deletedItem) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Item deleted successfully",
  });
});
