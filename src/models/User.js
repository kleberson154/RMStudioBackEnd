import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  usuario: String,
  senha: String,
  refreshTokens: [String]
})

export default mongoose.model('User', UserSchema)
