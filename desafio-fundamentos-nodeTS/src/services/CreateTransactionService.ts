import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'

interface CreateTransactionDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository
  }

  public execute({ title, value, type }: CreateTransactionDTO): Transaction {
    const balance = this.transactionsRepository.getBalance()

    if (type === 'outcome' && balance.total < value) {
      throw Error('Limite indisponivel para saque !')
    } else if ((type !== 'income') === (type !== 'outcome')) {
      throw Error('Operação inválida')
    }
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    })
    return transaction
  }
}

export default CreateTransactionService
