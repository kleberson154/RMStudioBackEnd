import Service from '../models/Service.js'

function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

export async function create(req, res) {
  try {
    const { nome, descricao, preco, duracaoMinutos, ativo } = req.body

    if (isEmpty(nome) || isEmpty(preco) || isEmpty(duracaoMinutos)) {
      return res.status(400).json({
        error: 'Nome, preço e duração em minutos são obrigatórios'
      })
    }

    const precoNumero = Number(preco)
    const duracaoNumero = Number(duracaoMinutos)

    if (Number.isNaN(precoNumero) || Number.isNaN(duracaoNumero)) {
      return res.status(400).json({
        error: 'Preço e duração em minutos devem ser números válidos'
      })
    }

    const ativoBooleano = isEmpty(ativo) ? true : toBoolean(ativo)

    if (ativoBooleano === undefined) {
      return res.status(400).json({
        error: 'Ativo deve ser true ou false'
      })
    }

    const service = await Service.create({
      nome,
      descricao: descricao ?? '',
      preco: precoNumero,
      duracaoMinutos: duracaoNumero,
      ativo: ativoBooleano
    })

    res.status(201).json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function list(req, res) {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getById(req, res) {
  try {
    const { id } = req.params
    const service = await Service.findById(id)

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' })
    }

    res.json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params
    const { nome, descricao, preco, duracaoMinutos, ativo } = req.body

    const dataToUpdate = {}

    if (!isEmpty(nome)) dataToUpdate.nome = nome
    if (descricao !== undefined) dataToUpdate.descricao = descricao

    if (!isEmpty(preco)) {
      const precoNumero = Number(preco)

      if (Number.isNaN(precoNumero)) {
        return res.status(400).json({
          error: 'Preço deve ser um número válido'
        })
      }

      dataToUpdate.preco = precoNumero
    }

    if (!isEmpty(duracaoMinutos)) {
      const duracaoNumero = Number(duracaoMinutos)

      if (Number.isNaN(duracaoNumero)) {
        return res.status(400).json({
          error: 'Duração em minutos deve ser um número válido'
        })
      }

      dataToUpdate.duracaoMinutos = duracaoNumero
    }

    if (!isEmpty(ativo)) {
      const ativoBooleano = toBoolean(ativo)

      if (ativoBooleano === undefined) {
        return res.status(400).json({
          error: 'Ativo deve ser true ou false'
        })
      }

      dataToUpdate.ativo = ativoBooleano
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        error: 'Informe ao menos um campo para atualizar'
      })
    }

    const service = await Service.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      runValidators: true
    })

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' })
    }

    res.json(service)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function remove(req, res) {
  try {
    const { id } = req.params
    const service = await Service.findByIdAndDelete(id)

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' })
    }

    res.json({ message: 'Serviço deletado com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
