export interface RouteTimeRequest {
  route_time_id: number;
  route_time_name: string;
  route_time_array: string[];
  route_time_com_id: number;
}

export interface RouteTicketPrice {
  route_ticket_price_type_id: number;
  route_ticket_location_start: number;
  route_ticket_location_stop: number;
  price: number;
  route_ticket_price_route_id: string;
  route_ticket_price_id?: string;
}

export interface RouteTicketWithPrices {
  route_ticket_id?: number;
  route_ticket_name_th: string;
  route_ticket_name_en: string;
  route_ticket_color: string;
  route_ticket_status: number;
  route_ticket_route_id: number;
  route_ticket_amount: number;
  route_ticket_type: string;
  route_ticket_price: RouteTicketPrice[];
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
