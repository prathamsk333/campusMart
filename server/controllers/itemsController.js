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


 // api for giving  product detials of the product , bidding detials of the product , who did the bidding , highest bid , etc take productid  , show all the bids on the product , product details , product owner details, status of the product through the ending time of the product    
 exports.getItemDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find item with populated owner and bids
  const item = await Item.findById(id)
    .populate({
      path: 'owner',
      select: 'name email rollNo' // Include only necessary user fields
    })
    .populate({
      path: 'bids.bidder',
      select: 'name email rollNo'
    });

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  // Determine the current status of the auction based on time
  const now = new Date();
  let status;
  
  if (now < item.biddingStartTime) {
    status = 'upcoming';
  } else if (now > item.biddingEndTime) {
    status = 'ended';
  } else {
    status = 'active';
  }

  // Sort bids by amount (highest first)
  const sortedBids = [...item.bids].sort((a, b) => b.amount - a.amount);
  
  // Calculate time remaining (if active)
  let timeRemaining = null;
  if (status === 'active') {
    timeRemaining = item.biddingEndTime - now; // in milliseconds
  }
 console.log(item)
  // Format response
  res.status(200).json({
    status: 'success',
    data: {
      item: {
        id: item._id,
        name: item.name,
        shortDescription: item.shortDescription,
        detailedDescription: item.detailedDescription,
        category: item.category,
        condition: item.condition,
        images: item.images,
        startingPrice: item.startingPrice,
        pickupLocation: item.pickupLocation,
        createdAt: item.createdAt
      },
      auction: {
        status,
        biddingStartTime: item.biddingStartTime,
        biddingEndTime: item.biddingEndTime,
        timeRemaining: status === 'active' ? timeRemaining : null,
        bidCount: item.bids.length,
        currentHighestBid: item.currentHighestBid || null
      },
      owner: item.owner,
      bids: sortedBids.map(bid => ({
        id: bid._id,
        bidder: bid.bidder,
        amount: bid.amount,
        biddedAt: bid.biddedAt
      }))
    }
  });
});
 // Create a new item
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
if (!accessKey || !secretAccessKey) {
  throw new Error("AWS credentials are not defined");
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: process.env.AWS_REGION
});
exports.createItem = catchAsync(async (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Files received:", req.files ? req.files.length : 0);
  
  if (!req.files || req.files.length === 0) {
    return next(new AppError('No image files uploaded', 400));
  }
  
  // Process all uploaded images
  const imageUrls = [];
  
  for (const file of req.files) {
    const imageName = randomImageName();
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    console.log("Uploading to S3 with params:", params);
    // Upload the image to S3

    
    const command = new PutObjectCommand(params);
    await s3.send(command);
    
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`;
    imageUrls.push(imageUrl);
  }
  
  // Add owner ID from authenticated user
  req.body.owner = req.user.id;
  
  // Create the item with all image URLs
  const newItem = await Item.create({
    ...req.body,
    images: imageUrls  // Store all image URLs in the images array
  });
  
  res.status(201).json({
    status: "success",
    data: {
      item: newItem,
    },
  });
});
// write a function to add a bid in the item by id of the item , id of the user and the amount of the bid , first check if active bid then amount positive , correct id of product , user and then add the bid to the item
exports.addBid = catchAsync(async (req, res, next) => {
  const { itemId, amount } = req.body;
  const userId = req.user.id; 

  if (!amount || amount <= 0) {
    return next(new AppError('Bid amount must be a positive number', 400));
  }

  const item = await Item.findById(itemId);
  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  const now = new Date();
  if (now < item.biddingStartTime || now > item.biddingEndTime) {
    return next(new AppError('Bidding is not active for this item', 400));
  }

  const currentHighestAmount = item.currentHighestBid?.amount || 0;
  const minimumBidAmount = Math.max(currentHighestAmount, item.startingPrice);
  
  if (amount <= minimumBidAmount) {
    return next(
      new AppError(
        `Bid amount must be higher than current highest bid or starting price (${minimumBidAmount})`,
        400
      )
    );
  }

  // Add the bid using the model method
  try {
    await item.addBid(userId, amount);

    res.status(201).json({
      status: 'success',
      data: {
        bid: {
          item: itemId,
          bidder: userId,
          amount,
          biddedAt: new Date()
        },
        currentHighestBid: item.currentHighestBid
      }
    });
  } catch (error) {
    return next(new AppError('Failed to add bid: ' + error.message, 400));
  }
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
