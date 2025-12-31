import mongoose, { Schema, Document } from 'mongoose'

export interface IExpense extends Document {
  userId: mongoose.Types.ObjectId
  icon: string
  category: string
  amount: number
  date: Date
  createdAt: Date
  updatedAt: Date
}

const expenseSchema = new Schema<IExpense>(
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters']
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

const Expense = mongoose.model<IExpense>('Expense', expenseSchema)

export default Expense
