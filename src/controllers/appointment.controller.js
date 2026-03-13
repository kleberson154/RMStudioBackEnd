import Appointment from '../models/Appointment.js'

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizeDateString(value) {
  if (typeof value !== 'string') return value
  if (value.includes('T')) return value.split('T')[0]
  return value
}

function normalizeCpf(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/\D/g, '')
}

function formatCpf(value) {
  if (value.length !== 11) return value
  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function isValidSchedule(date, time, hours) {
  const day = new Date(date).getDay()

  // Domingo ou segunda
  if (day === 0 || day === 1) return false

  let hour = parseInt(time)

  for (let i = 0; i < hours; i++) {
    if (hour < 9 || hour >= 18) return false
    if (hour === 12) return false

    hour++
    if (hour === 12) hour++
  }

  return true
}

async function checkAvailability(data, horario) {
  try {
    const normalizedData = normalizeDateString(data)
    const agendamentos = await Appointment.find({
      data: normalizedData,
      horario: horario,
      status: { $ne: 'cancelado' }
    })

    const isAvailable = agendamentos.length === 0

    return {
      available: isAvailable,
      isAvailable: isAvailable,
      disponivel: isAvailable
    }
  } catch (error) {
    return {
      available: true,
      isAvailable: true,
      disponivel: true
    }
  }
}

export async function create(req, res) {
  try {
    const { nome, cpf, telefone, servicos, data, horario } = req.body

    if (!servicos || !Array.isArray(servicos) || servicos.length === 0) {
      return res.status(400).json({
        error: 'É necessário selecionar pelo menos um serviço'
      })
    }

    if (!isValidSchedule(data, horario, servicos.length)) {
      return res.status(400).json({
        error:
          'Horário inválido. O salão funciona de terça a sábado, das 9h às 18h (exceto 12h).'
      })
    }

    const availability = await checkAvailability(data, horario)

    if (!availability.isAvailable || !availability.disponivel) {
      return res.status(409).json({
        error:
          'Este horário não está mais disponível. Por favor, escolha outro.'
      })
    }

    const agendamento = await Appointment.create({
      ...req.body,
      data: normalizeDateString(data)
    })

    res.status(201).json(agendamento)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function list(req, res) {
  try {
    const agendamentos = await Appointment.find()
    res.json(agendamentos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function listByDate(req, res) {
  try {
    const { date } = req.params
    const normalizedDate = normalizeDateString(date)
    const escapedDate = escapeRegex(normalizedDate)

    const agendamentos = await Appointment.find({
      data: { $regex: new RegExp(`^${escapedDate}`) }
    })
    res.json(agendamentos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function hasPendingByCpf(req, res) {
  try {
    const { cpf } = req.params
    const cpfOriginal = (cpf || '').trim()
    const cpfNumerico = normalizeCpf(cpfOriginal)

    if (!cpfOriginal) {
      return res.status(400).json({ error: 'CPF é obrigatório' })
    }

    const cpfs = new Set([cpfOriginal])

    if (cpfNumerico) {
      cpfs.add(cpfNumerico)
      cpfs.add(formatCpf(cpfNumerico))
    }

    const hasPending = await Appointment.exists({
      cpf: { $in: Array.from(cpfs) },
      status: 'pendente'
    })

    res.json({ temAgendamentoPendente: Boolean(hasPending) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

async function updateStatus(req, res, status) {
  try {
    const { id } = req.params

    const agendamento = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' })
    }

    res.json(agendamento)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function finalize(req, res) {
  return updateStatus(req, res, 'finalizado')
}

export async function cancel(req, res) {
  return updateStatus(req, res, 'cancelado')
}

export async function getByDataAndHorario(req, res) {
  try {
    const { data, horario } = req.params
    const normalizedData = normalizeDateString(data)

    const agendamentos = await Appointment.find({
      data: normalizedData,
      horario: horario,
      status: { $ne: 'cancelado' }
    })

    const isAvailable = agendamentos.length === 0

    res.json({
      data: normalizedData,
      horario: horario,
      available: isAvailable,
      isAvailable: isAvailable,
      disponivel: isAvailable,
      agendamentos: agendamentos
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
