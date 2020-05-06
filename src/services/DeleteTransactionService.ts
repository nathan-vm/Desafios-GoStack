import { getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError'

import TransactionRepository from '../repositories/TransactionsRepository'

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactioRepository = getCustomRepository(TransactionRepository)

    const transaction = await transactioRepository.findOne(id)

    if (!transaction) {
      throw new AppError('Transaction does not exist')
    }

    await transactioRepository.remove(transaction)
  }
}

export default DeleteTransactionService
