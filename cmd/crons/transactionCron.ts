import cron from 'node-cron';
import { TransactionService } from '../../internal/domain/transaction/transaction/transactionService';



export const TransactionTimeoutJob = (transactionService:TransactionService) => {
  cron.schedule("* * * * *"    , async () => {
    console.log('Start checking transaction timeout');

    await transactionService.checkTransactionsTimeout()

    console.log('Finish checking transaction timeout');
  });
};
