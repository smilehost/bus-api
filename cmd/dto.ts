export interface JwtPayloadUser {
  account_id: number;
  account_role: string;
  com_id: number;
  login_at: number;
  iat: number;
  exp: number;
}

export interface TicketRemainDTO {
  ticket_remain_date: string;
  ticket_remain_time: string;
  ticket_remain_route_ticket_id: number;
}
