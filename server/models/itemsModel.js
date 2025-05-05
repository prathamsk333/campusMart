const mongoose = require("mongoose");
const validator = require("validator");

// Define a bid schema for embedding in items
const bidSchema = new mongoose.Schema({
    bidder: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A bid must have a bidder']
    },
    amount: {
        type: Number,
        required: [true, 'A bid must have an amount'],
        min: [1, 'Bid amount must be at least 1']
    },
    biddedAt: {
        type: Date,
        default: Date.now
    }
});

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
    status:{
        type: String,
        enum: ['active', 'closed', 'upcoming', 'ended'],
        default: 'active' 
    } ,
    pickupLocation: {
        type: String,
        required: [true, "Please provide the pickup location!"],
        trim: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An item must have an owner']
    },
    winner:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    } ,
    images: {
        type: [String],
        validate: {
            validator: function (v) {
                return v.every((url) => validator.isURL(url));
            },
            message: "Each image must be a valid URL.",
        },
    },
    bids: [bidSchema], // Array of bids
    currentHighestBid: {
        amount: Number,
        bidder: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        biddedAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
itemSchema.virtual('currentStatus').get(function() {
    const now = new Date();
    
    if (now < this.biddingStartTime) {
        return 'upcoming';
    } else if (now >= this.biddingStartTime && now <= this.biddingEndTime) {
        return 'active';
    } else {
        return 'ended';
    }
});
itemSchema.virtual('timeRemaining').get(function() {
    if (this.currentStatus === 'active') {
        return this.biddingEndTime - new Date();
    }
    return null;
});
itemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'bids.bidder',
        select: 'name email'
    }).populate({
        path: 'currentHighestBid.bidder',
        select: 'name email'
    });
    next();
});
itemSchema.pre(/^find/, function(next) {
   const now = new Date();
        Item.updateMany(
        { biddingStartTime: { $gt: now }, status: { $ne: 'upcoming' } },
        { status: 'upcoming' }
    ).exec();
    
    Item.updateMany(
        { 
            biddingStartTime: { $lte: now }, 
            biddingEndTime: { $gte: now },
            status: { $ne: 'active' }
        },
        { status: 'active' }
    ).exec();
    
    Item.updateMany(
        { biddingEndTime: { $lt: now }, status: { $ne: 'ended' } },
        { status: 'ended' }
    ).exec();
    
    next();
});
// Method to add a new bid
itemSchema.methods.addBid = function(userId, amount) {
    const newBid = {
        bidder: userId,
        amount: amount,
        biddedAt: Date.now()
    };
    this.bids.push(newBid);
        if (!this.currentHighestBid || amount > this.currentHighestBid.amount) {
        this.currentHighestBid = newBid;
    }
    
    return this.save();
};

// Virtual property to get the number of bids
itemSchema.virtual('bidCount').get(function() {
    return this.bids.length;
});     
itemSchema.post(/^find/, async function(docs) {
    if (!docs) return;
    
    // Handle both single document and array of documents
    const items = Array.isArray(docs) ? docs : [docs];
    const now = new Date();
    
    for (const item of items) {
      // Skip if not a mongoose document or if already has a winner
      if (!item || !item.biddingEndTime || item.winner) continue;
      
      // Check if auction has ended and there's no winner yet
      if (now > item.biddingEndTime && item.currentHighestBid && item.currentHighestBid.bidder) {
        // Set the winner to the current highest bidder
        item.winner = item.currentHighestBid.bidder;
        item.status = 'ended';
        
        // Save the changes
        await Item.findByIdAndUpdate(item._id, {
          winner: item.currentHighestBid.bidder,
          status: 'ended'
        });
        
        console.log(`Winner set for item ${item._id}: ${item.winner}`);
      }
    }
  });                                           

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;