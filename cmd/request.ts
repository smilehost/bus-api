export interface RouteTimeRequest {
  route_time_id: number;
  route_time_name: string;
  route_time_array: string[];
  route_time_com_id: number;
}

export interface RouteTicketPrice {
  route_ticket_price_ticket_id: number; // FK → route_ticket
  route_ticket_price_type_id: number; // FK → ticket_price_type
  route_ticket_location_start: number; // FK → route_location
  route_ticket_location_stop: number; // FK → route_location
  price: number;
  route_ticket_price_route_id: string; // FK → route (ระบุเป็น string เพราะในตัวอย่างเป็นพวก "281.19")
  route_ticket_price_id: string; // uniq_id (string ในตัวอย่าง)
}

export interface RouteTicketWithPrices {
  route_ticket_id?: number; // หากส่งใหม่ไม่ต้องระบุ ID
  route_ticket_name_th: string;
  route_ticket_name_en: string;
  route_ticket_color: string;
  route_ticket_status: number;
  route_ticket_route_id: number; // FK → route
  route_ticket_amount: number;
  route_ticket_type: string;
  list_route_ticket_price: RouteTicketPrice[];
}
