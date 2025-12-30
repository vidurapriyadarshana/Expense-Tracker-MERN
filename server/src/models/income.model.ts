import mongoose, { Schema, Document } from 'mongoose'

export interface IIncome extends Document {
  userId: mongoose.Types.ObjectId
  icon: string
  source: string
  amount: number
  date: Date
  createdAt: Date
  updatedAt: Date
}

const incomeSchema = new Schema<IIncome>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
      maxlength: [100, 'Source cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

const Income = mongoose.model<IIncome>('Income', incomeSchema)

export default Income
