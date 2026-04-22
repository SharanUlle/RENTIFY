import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export interface NotificationAttributes {
  id: string;
  user_id: string;
  type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'rental_started' | 'rental_completed' | 'payment_received' | 'review_received' | 'general';
  title: string;
  message: string;
  data?: object;           // extra payload (rental_id, product_id etc.)
  is_read: boolean;
  created_at?: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'is_read'> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public user_id!: string;
  public type!: NotificationAttributes['type'];
  public title!: string;
  public message!: string;
  public data?: object;
  public is_read!: boolean;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM(
        'booking_request',
        'booking_approved',
        'booking_rejected',
        'rental_started',
        'rental_completed',
        'payment_received',
        'review_received',
        'general'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    updatedAt: false,
  }
);

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

export default Notification;
