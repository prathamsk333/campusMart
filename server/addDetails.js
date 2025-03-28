import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './itemModel.js';

dotenv.config(); // Load environment variables from .env

const mongoURI = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/yourDB';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedItems = async () => {
    try {
        await Item.deleteMany(); // Clear existing items (optional)
        const items = [
            {
                name: "Vintage Camera",
                shortDescription: "A classic film camera",
                detailedDescription: "A vintage 35mm film camera in great condition.",
                startingPrice: 50,
                biddingStartTime: new Date(),
                biddingEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
                condition: "Used",
                category: "Electronics",
                pickupLocation: "New York, USA",
                images: ["https://example.com/camera.jpg"],
            },
            {
                name: "Antique Table",
                shortDescription: "Solid wood antique table",
                detailedDescription: "A beautifully crafted wooden table from the 19th century.",
                startingPrice: 200,
                biddingStartTime: new Date(),
                biddingEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
                condition: "Used",
                category: "Furniture",
                pickupLocation: "Los Angeles, USA",
                images: ["https://example.com/table.jpg"],
            }
        ];

        await Item.insertMany(items);
        console.log('Items added successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error adding items:', error);
        mongoose.connection.close();
    }
};

seedItems();
