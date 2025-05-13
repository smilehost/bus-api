export interface Account {
  account_id: number;
  account_username: string;
  account_password: string;
  account_name: string;
  account_com_id: number;
  account_menu: string;
  account_status: number;
  account_role: string;
}

export interface Company {
  com_id: number;
  com_prefix: string;
  com_name: string;
  com_status: number;
}

export interface Member {
  member_id: number;
  member_com_id: number;
  member_phone: string;
  member_date_time: string;
}

export interface PaymentMethod {
  payment_method_id: number;
  payment_method_name: string;
  payment_method_status: number;
}

export interface Route {
  route_id: number;
  route_name_th: string;
  route_name_en: string;
  route_color: string;
  route_status: number;
  route_com_id: number;
  route_date_id: number;
  route_time_id: number;
  route_array: string;
  route_time?: RouteTime;
  route_date?: RouteDate;
}

export interface RouteDate {
  route_date_id: number;
  route_date_name: string;
  route_date_start: string;
  route_date_end: string;
  route_date_mon: number;
  route_date_tue: number;
  route_date_wen: number;
  route_date_thu: number;
  route_date_fri: number;
  route_date_sat: number;
  route_date_sun: number;
  route_date_com_id: number;
  routes?: Route[];
}

export interface RouteLocation {
  route_location_id: number;
  route_location_name: string;
  route_location_lat: string;
  route_location_long: string;
  route_location_com_id: number;
}

export interface RouteTime {
  route_time_id?: number;
  route_time_name: string;
  route_time_array: string;
  route_time_com_id: number;
  route?: Route[];
}

export interface Transaction {
  transaction_id: number;
  transaction_com_id: number;
  transaction_datetime: string;
  transaction_lat: string;
  transaction_long: string;
  transaction_payment_method_id: number;
  transaction_amount: string;
  transaction_pax: number;
  transaction_member_id: number;
}

export interface TicketDiscount {
  ticket_discount_id: number;
  ticket_discount_name: string;
  ticket_discount_type: number;
  ticket_discount_value: string;
}

export interface RouteTicket {
  route_ticket_id: number;
  route_ticket_name_th: string;
  route_ticket_name_en: string;
  route_ticket_color: string;
  route_ticket_status: number;
  route_ticket_route_id: number;
  route_ticket_amount: number;
  route_ticket_type: string;
  route_ticket_price?: RouteTicketPrice[];
}

export interface RouteTicketPrice {
  route_ticket_price_id: number;
  route_ticket_location_start: string;
  route_ticket_location_stop: string;
  price: string;
  route_ticket_price_type_id: number;
  route_ticket_price_ticket_id: number;
  route_ticket_price_route_id: number;
  route_ticket?: RouteTicket;
}

export interface RouteTicketPriceType {
  route_ticket_price_type_id: number;
  route_ticket_price_type_name: string;
  route_ticket_price_type_com_id: number;
}

export interface TicketRemain {
  ticket_remain_id: string;
  ticket_remain_date: string;
  ticket_remain_time: string;
  ticket_remain_number: number;
  ticket_remain_route_ticket_id: number;
}