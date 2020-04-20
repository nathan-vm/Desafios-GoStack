import Transaction from '../models/Transaction'
// import CreateTransactionService from '../services/CreateTransactionService'

interface Balance {
  income: number
  outcome: number
  total: number
}

interface CreateTransactionDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
}

class TransactionsRepository {
  private transactions: Transaction[]

  constructor() {
    this.transactions = []
  }

  public all(): Transaction[] {
    return this.transactions
  }

  public getBalance(): Balance {
    let income = 0
    let outcome = 0
    let total = 0
    this.transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        income += transaction.value
      } else if (transaction.type === 'outcome') {
        outcome += transaction.value
      }
    })
    total = income - outcome

    return { income, outcome, total }
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type })
    this.transactions.push(transaction)
    return transaction
  }
}

export default TransactionsRepository
