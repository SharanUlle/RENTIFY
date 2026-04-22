import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Product from './Product';
import Rental from './Rental';

export interface ReviewAttributes {
  id: string;
  rental_id: string;
  product_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;           // 1–5
  comment: string;
  review_type: 'product' | 'owner' | 'renter';
  created_at?: Date;
  updated_at?: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: string;
  public rental_id!: string;
  public product_id!: string;
  public reviewer_id!: string;
  public reviewee_id!: string;
  public rating!: number;
  public comment!: string;
  public review_type!: 'product' | 'owner' | 'renter';
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rental_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'rentals', key: 'id' },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'products', key: 'id' },
    },
    reviewer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    reviewee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    review_type: {
      type: DataTypes.ENUM('product', 'owner', 'renter'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
  }
);

// Associations
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });
Review.belongsTo(Rental, { foreignKey: 'rental_id', as: 'rental' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

export default Review;
