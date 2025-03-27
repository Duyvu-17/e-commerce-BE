import express from "express";
import customerController from "../../controllers/admin/customerController.js";

const router = express.Router();

router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

export default router;
