import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Product from './Product';

export type RentalType = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type RentalStatus = 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected';

export interface RentalAttributes {
  id: string;
  product_id: string;
  renter_id: string;
  owner_id: string;
  start_date: Date;
  end_date: Date;
  rental_type: RentalType;
  total_days: number;
  rental_price: number;
  deposit_amount: number;
  total_amount: number;
  status: RentalStatus;
  payment_intent_id?: string;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  notes?: string;
  cancellation_reason?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface RentalCreationAttributes
  extends Optional<RentalAttributes, 'id' | 'status' | 'payment_status'> {}

class Rental extends Model<RentalAttributes, RentalCreationAttributes> implements RentalAttributes {
  public id!: string;
  public product_id!: string;
  public renter_id!: string;
  public owner_id!: string;
  public start_date!: Date;
  public end_date!: Date;
  public rental_type!: RentalType;
  public total_days!: number;
  public rental_price!: number;
  public deposit_amount!: number;
  public total_amount!: number;
  public status!: RentalStatus;
  public payment_intent_id?: string;
  public payment_status!: 'pending' | 'paid' | 'refunded' | 'failed';
  public notes?: string;
  public cancellation_reason?: string;
}

Rental.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    renter_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    rental_type: {
      type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly'),
      defaultValue: 'daily',
    },
    total_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rental_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deposit_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'),
      defaultValue: 'pending',
    },
    payment_intent_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Rental',
    tableName: 'rentals',
    timestamps: true,
    underscored: true,
    validate: {
      endAfterStart(this: Rental) {
        if (new Date(this.end_date) < new Date(this.start_date)) {
          throw new Error('end_date must be after start_date');
        }
      },
    },
  }
);

// Associations
Rental.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Rental.belongsTo(User, { foreignKey: 'renter_id', as: 'renter' });
Rental.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Product.hasMany(Rental, { foreignKey: 'product_id', as: 'rentals' });

export default Rental;
