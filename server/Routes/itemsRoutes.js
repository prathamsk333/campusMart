const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
const itemsController = require("../controllers/itemsController");
const authController = require("../controllers/authController");
router.get("/getAllItems", itemsController.getAllItems);
router.get("/item/:id", itemsController.getItemById);
router.post('/bid', authController.protect, itemsController.addBid);
router.get('/item_details/:id', itemsController.getItemDetails);
router.post("/createItem", authController.protect,upload.array('images', 5), itemsController.createItem);
router.put("/updateItem/:id", itemsController.updateItem);
router.delete("/deleteItem/:id", itemsController.deleteItem);

module.exports = router;

