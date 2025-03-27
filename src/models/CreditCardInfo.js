import  DataTypes  from "sequelize";
import sequelize from "../config/database.js";


const CreditCardInfo = sequelize.define("CreditCardInfo", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cardholderName: { type: DataTypes.STRING, allowNull: false },
  encrypt_card_number: { type: DataTypes.STRING, allowNull: false },  
  expiryDate: { type: DataTypes.STRING, allowNull: false },
  cvv: { type: DataTypes.STRING, allowNull: false },
});

export default CreditCardInfo;
