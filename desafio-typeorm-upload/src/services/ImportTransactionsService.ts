import { getCustomRepository, getRepository, In } from 'typeorm'
import CsvParse from 'csv-parse'
import fs from 'fs'

import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'
import Category from '../models/Category'

interface CsvTransaction {
  title: string
  value: number
  type: 'income' | 'outcome'
  category: string
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)
    const categoriesRepository = getRepository(Category)

    const contactsReadStream = fs.createReadStream(filePath)
    const parsers = CsvParse({
      from_line: 2,
    })

    const parseCsv = contactsReadStream.pipe(parsers)

    const transactions: CsvTransaction[] = []
    const categories: string[] = []

    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => {
        return cell.trim()
      })

      if (!title || !type || !value) {
        return
      }

      categories.push(category)

      transactions.push({ title, type, value, category })
    })

    await new Promise(resolve => parseCsv.on('end', resolve))

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    })

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    )

    const addCategoriesTitle = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index)

    // 1:31

    const newCategories = categoriesRepository.create(
      addCategoriesTitle.map(title => ({ title })),
    )

    await categoriesRepository.save(newCategories)

    const finalCategories = [...newCategories, ...existentCategories]

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    )

    await transactionsRepository.save(createdTransactions)

    await fs.promises.unlink(filePath)

    return createdTransactions
  }
}

export default ImportTransactionsService
