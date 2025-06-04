// path: internal/controller/ticketController.ts
import { Request, Response } from "express";
import * as fs from 'fs';
import * as path from 'path';
import { TicketService } from "../service/ticketService";
import { AppError } from "../utils/appError";
import { Util } from "../utils/util";
import { ExceptionHandler } from "../utils/exception";

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<void,void,
        {page: number; size: number; search: string, status: string }
      >(req, {query: true,});

      const result = await this.ticketService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search,
        query.status
      )

      res.status(200).json({
        message: "Tickets retrieved successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async cancelTicket(req: Request, res: Response) {
    try {
      const { com_id, body} = Util.extractRequestContext<
        {ticket_uuid:string,ticket_note:string}
      >(req, {body:true});

      const result = await this.ticketService.cancelTicket(body.ticket_uuid,body.ticket_note)
      res.status(200).json({
        message: "Tickets cancelled successfully",
        result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }else{
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async viewTicketByUuid(req: Request, res: Response) {
    try {

      const ticketData = await this.ticketService.getTicketForView(
        req.params.ticket_uuid
      );

      // Helper to format date and time
      const formatThaiDateTime = (dateString: string, timeString: string) => {
        try {
          const date = new Date(dateString);
          const [hours, minutes] = timeString.split(':');
          date.setHours(parseInt(hours, 10));
          date.setMinutes(parseInt(minutes, 10));
          
          return new Intl.DateTimeFormat("th-TH", {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Bangkok' 
          }).format(date);
        } catch (e) {
          // Fallback if date/time parsing fails
          return `${dateString} ${timeString}`;
        }
      };
      
      const viewsDir = path.join(__dirname, '..', 'views');
      let ticketViewHtml = fs.readFileSync(path.join(viewsDir, 'ticketView.html'), 'utf-8');

      ticketViewHtml = ticketViewHtml
        .replace(/{{ticket_uuid}}/g, ticketData.ticket_uuid)
        .replace(/{{ticket_datetime}}/g, formatThaiDateTime(ticketData.ticket_date, ticketData.ticket_time))
        .replace(/{{ticket_type_name}}/g, ticketData.route_ticket_name_th || ticketData.ticket_type)
        .replace(/{{ticket_price}}/g, ticketData.ticket_discount_price.toFixed(2))
        .replace(/{{ticket_status_raw}}/g, ticketData.ticket_status)
        .replace(/{{ticket_status}}/g, ticketData.ticket_status) // You might want a more user-friendly status name here
        .replace(/{{ticket_route}}/g, `${ticketData.start_location_name || 'N/A'} - ${ticketData.stop_location_name || 'N/A'}`)
        .replace(/{{ticket_route_name}}/g, ticketData.route_ticket?.route_ticket_name_th || 'N/A')
        .replace(/{{ticket_note}}/g, ticketData.ticket_note || '-');

      res.setHeader("Content-Type", "text/html");
      res.status(200).send(ticketViewHtml);
    } catch (error) {
      const viewsDir = path.join(__dirname, '..', 'views');
      let errorViewHtml = fs.readFileSync(path.join(viewsDir, 'errorView.html'), 'utf-8');

      if (error instanceof AppError) {
        errorViewHtml = errorViewHtml
          .replace(/{{error_title}}/g, 'เกิดข้อผิดพลาด')
          .replace(/{{error_message}}/g, error.message)
          .replace(/{{#if show_back_link}}[\s\S]*?{{\/if}}/g, '<p><a href="javascript:history.back()">กลับไปหน้าก่อนหน้า</a></p>'); // Simple replace for conditional block

        res.setHeader("Content-Type", "text/html");
        res.status(error.statusCode).send(errorViewHtml);
      } else {
        console.error("Internal Server Error:", error);
        errorViewHtml = errorViewHtml
          .replace(/{{error_title}}/g, 'เกิดข้อผิดพลาดภายในระบบ')
          .replace(/{{error_message}}/g, 'ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้งในภายหลัง')
          .replace(/{{#if show_back_link}}[\s\S]*?{{\/if}}/g, ''); // Remove back link for internal errors

        res.setHeader("Content-Type", "text/html");
        res.status(500).send(errorViewHtml);
      }
    }
  }
}
