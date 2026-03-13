import mongoose from 'mongoose'

const AppointmentSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: true
  },
  telefone: {
    type: String,
    required: true
  },
  servicos: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
      }
    ],
    required: true
  },
  data: {
    type: String,
    required: true
  },
  horario: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pendente',
    enum: ['pendente', 'finalizado', 'cancelado']
  }
})

export default mongoose.model('Appointment', AppointmentSchema)
