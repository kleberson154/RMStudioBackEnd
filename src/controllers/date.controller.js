import DateModel from '../models/Date.js'

export async function getDaysBlocks(req, res) {
  try {
    const blockedDates = await DateModel.find()
    res.status(200).json(blockedDates)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function addDayBlock(req, res) {
  const { dayBlock } = req.body

  try {
    const blockedDatesDoc = await DateModel.findOne()

    if (!blockedDatesDoc) {
      await DateModel.create({
        daysBlock: [dayBlock],
        hoursCustomized: []
      })
    } else {
      await DateModel.findByIdAndUpdate(blockedDatesDoc._id, {
        $addToSet: { daysBlock: dayBlock }
      })
    }

    res.status(201).json({ message: 'Data bloqueada' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function removeDayBlock(req, res) {
  const { dayBlock } = req.body

  try {
    await DateModel.findOneAndUpdate({}, { $pull: { daysBlock: dayBlock } })
    res.status(200).json({ message: 'Data desbloqueada' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function addCustomHours(req, res) {
  const { date, hoursToWork } = req.body

  try {
    const doc = await DateModel.findOne()

    if (!doc) {
      await DateModel.create({
        daysBlock: [],
        hoursCustomized: [{ date, hoursToWork }]
      })
    } else {
      // Remove horário customizado anterior para a mesma data e adiciona o novo
      await DateModel.findByIdAndUpdate(doc._id, {
        $pull: { hoursCustomized: { date } }
      })
      await DateModel.findByIdAndUpdate(doc._id, {
        $push: { hoursCustomized: { date, hoursToWork } }
      })
    }

    res.status(201).json({ message: 'Horário de funcionamento definido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function getCustomHours(req, res) {
  try {
    const doc = await DateModel.findOne()
    const hoursCustomized = doc?.hoursCustomized || []
    res.status(200).json(hoursCustomized)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function removeCustomHours(req, res) {
  const { date } = req.body

  try {
    await DateModel.findOneAndUpdate(
      {},
      {
        $pull: { hoursCustomized: { date } }
      }
    )
    res.status(200).json({ message: 'Horário customizado removido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
