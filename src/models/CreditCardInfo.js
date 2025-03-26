const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CreditCardInfo = sequelize.define("CreditCardInfo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cardholderName: { type: DataTypes.STRING, allowNull: false },
  encrypt_card_number: { type: DataTypes.STRING, allowNull: false },  
  expiryDate: { type: DataTypes.STRING, allowNull: false },
  cvv: { type: DataTypes.STRING, allowNull: false },
});

module.exports = CreditCardInfo;
