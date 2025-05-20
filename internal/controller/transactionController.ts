// import { Request, Response } from "express";
// import { TransactionService } from "../service/transactionService";
// import { ExceptionHandler } from "../utils/exception";
// import { AppError } from "../utils/appError";
// import { Util } from "../utils/util";
// import { CreateTransactionTicketsDto } from "../../cmd/dto";

// export class TransactionController {
//   constructor(private readonly transactionService: TransactionService) {}

//   async create(req: Request, res: Response) {
//     try {
      
//       const { com_id, body } = Util.extractRequestContext<CreateTransactionTicketsDto>(req, {
//         body: true,
//       });

//       const result = await this.transactionService.create(com_id, body);

//       res.status(201).json({
//         message: "Transaction created successfully",
//         result,
//       });
//     } catch (error) {
//       if (error instanceof AppError) {
//         res.status(error.statusCode).json({
//           error: error.name,
//           message: error.message,
//         });
//       }else {
//           ExceptionHandler.internalServerError(res, error);
//       }
//     }
//   }
// }
