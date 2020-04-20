import { Router } from 'express'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService'
import ListTransactionsService from '../services/ListTransactionsService'

const transactionRouter = Router()

const transactionsRepository = new TransactionsRepository()

transactionRouter.get('/', (request, response) => {
  try {
    const ListTransaction = new ListTransactionsService(transactionsRepository)
    const all = ListTransaction.execute()
    return response.json(all)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body

    const newValue = Number(value)

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    )

    const transaction = createTransaction.execute({
      title,
      value: newValue,
      type,
    })

    return response.json(transaction)
  } catch (err) {
    return response.status(400).json({ error: err.message })
  }
})

export default transactionRouter
