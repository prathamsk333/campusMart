const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
const itemsController = require("../controllers/itemsController");

router.get("/getAllItems", itemsController.getAllItems);
router.get("/item/:id", itemsController.getItemById);
router.post("/createItem", upload.single("images"), itemsController.createItem);
router.put("/updateItem/:id", itemsController.updateItem);
router.delete("/deleteItem/:id", itemsController.deleteItem);

module.exports = router;

