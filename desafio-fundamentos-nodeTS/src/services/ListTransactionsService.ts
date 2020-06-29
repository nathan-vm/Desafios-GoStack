import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'
import Balance from '../models/Balance'

interface All {
  transactions: Transaction[]
  balance: Balance
}

class ListTransactionsService {
  private transactionsRepository: TransactionsRepository

  private balance = new Balance({ income: 0, outcome: 0, total: 0 })

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository
  }

  public execute(): All {
    const all = this.transactionsRepository.all()

    all.forEach(transaction => {
      if (transaction.type === 'income') {
        this.balance.income += transaction.value
      } else if (transaction.type === 'outcome') {
        this.balance.outcome += transaction.value
      }
      this.balance.total = this.balance.income - this.balance.outcome
    })

    const Extract = {
      transactions: all,
      balance: this.balance,
    }
    return Extract
  }
}

export default ListTransactionsService
