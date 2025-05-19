import { ticket, transaction } from "@prisma/client";

export interface JwtPayloadUser {
  account_id: number;
  account_role: string;
  com_id: number;
  login_at: number;
  iat: number;
  exp: number;
}

export interface GetRemainNumberDTO {
  ticket_remain_date: string;
  ticket_remain_time: string;
  ticket_remain_route_ticket_id: number;
}

export interface GetRemainByRouteTimeDTO {
  ticket_id: number;
  ticket_remain_date: string;
  route_time_id: number;
}

export type CreateTicketDto = Omit<ticket,'ticket_id'|'ticket_transaction_id'> & {
  ticket_transaction_id:number|null
}

export type CreateTransactionDto = Omit<transaction, 'transaction_id'| 'transaction_member_id'> & {
  transaction_member_id:number|null
};

export interface CreateTransactionTicketsDto extends CreateTransactionDto {
  member_phone?:string;
  tickets:CreateTicketDto[];
}

export interface ShiftingRemainDto {
  date: string;
  time: string;
  routeTicketId: number; 
  maxTicket:number;
  amount: number;
}
