import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface ProductAttributes {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  model_name: string;
  hourly_rate?: number;
  daily_rate: number;
  weekly_rate?: number;
  monthly_rate?: number;
  deposit: number;
  condition: 'new' | 'like_new' | 'good' | 'fair';
  images: string[];
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  is_available: boolean;
  rental_count: number;
  average_rating: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'id' | 'is_available' | 'rental_count' | 'average_rating' | 'images'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: string;
  public owner_id!: string;
  public title!: string;
  public description!: string;
  public category!: string;
  public brand!: string;
  public model_name!: string;
  public hourly_rate?: number;
  public daily_rate!: number;
  public weekly_rate?: number;
  public monthly_rate?: number;
  public deposit!: number;
  public condition!: 'new' | 'like_new' | 'good' | 'fair';
  public images!: string[];
  public city!: string;
  public state!: string;
  public latitude?: number;
  public longitude?: number;
  public is_available!: boolean;
  public rental_count!: number;
  public average_rating!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    model_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    daily_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    weekly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    monthly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM('new', 'like_new', 'good', 'fair'),
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rental_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    average_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    underscored: true,
  }
);

// Association
Product.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(Product, { foreignKey: 'owner_id', as: 'products' });

export default Product;
