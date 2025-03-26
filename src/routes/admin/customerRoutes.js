const express = require("express");
const router = express.Router();
const { getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require("../../controllers/admin/customerController");

router.get("/",  getCustomers);
router.get("/:id",  getCustomerById);
router.put("/:id",  updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
