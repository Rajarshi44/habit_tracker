import mongoose, { Schema, Document } from 'mongoose';

export interface IUserStore extends Document {
  email: string;
  state: string; // Storing the stringified JSON state directly
  updatedAt: Date;
}

const UserStoreSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  state: { type: String, required: true },
}, {
  timestamps: true,
});

const UserStore = (mongoose.models.UserStore as mongoose.Model<IUserStore>) || mongoose.model<IUserStore>('UserStore', UserStoreSchema);

export default UserStore;
