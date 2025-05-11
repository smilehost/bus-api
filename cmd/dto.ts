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
  route_time_id: number; // หรือใช้ Date ถ้าต้องการ parse เป็น Date object
}