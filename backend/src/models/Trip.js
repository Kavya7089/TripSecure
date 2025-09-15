const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  type: String, amount: Number, date: Date, note: String
});

const tripSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },
  itinerary: [{ place: String, dateFrom: Date, dateTo: Date }],
  startDate: Date,
  endDate: Date,
  expenses: [expenseSchema],
  status: { type: String, enum: ['PLANNED','ONGOING','ENDED'], default: 'PLANNED' }
});

module.exports = mongoose.model('Trip', tripSchema);
