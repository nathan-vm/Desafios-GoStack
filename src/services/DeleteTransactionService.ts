import { getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError'

import Transaction from '../models/Transaction'

import TransactionRepository from '../repositories/TransactionsRepository'

class DeleteTransactionService {
  public async execute(): Promise<void> {
    const transactioRepository = new getCustomRepository(TransactionRepository)
  }
}

export default DeleteTransactionService
