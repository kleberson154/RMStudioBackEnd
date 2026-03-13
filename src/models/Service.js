import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },
    descricao: {
      type: String,
      default: ''
    },
    preco: {
      type: Number,
      required: true
    },
    duracaoMinutos: {
      type: Number,
      required: true
    },
    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Service', ServiceSchema)
