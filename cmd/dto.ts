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

export interface TransactionTicketDto {
  ticket_time: string;
  ticket_type: string;
  ticket_price: string;
}

export interface CreateTransactionDto {
  transaction_lat: string;
  transaction_long: string;
  transaction_payment_method_id: number;
  transaction_amount: string;
  transaction_pax: number;
  member_phone: string;
  tickets: TransactionTicketDto[];
}
