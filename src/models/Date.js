import mongoose from 'mongoose'

const DateSchema = new mongoose.Schema({
  daysBlock: [String],
  hoursCustomized: [
    {
      date: String,
      hoursToWork: [String]
    }
  ]
})

export default mongoose.model('Date', DateSchema)
