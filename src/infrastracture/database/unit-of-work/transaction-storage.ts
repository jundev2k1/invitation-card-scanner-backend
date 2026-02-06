import { AsyncLocalStorage } from "async_hooks";
import { DatabaseTransactionConnection } from "slonik";

export const transactionStorage = new AsyncLocalStorage<DatabaseTransactionConnection>();
