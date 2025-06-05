// path: internal/controller/ticketController.ts
import { Request, Response } from "express";
import * as fs from 'fs';
import * as path from 'path';
import { TicketService } from "./ticketService";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";


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
      
      const htmlResponse = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ข้อมูลตั๋ว</title>
        <style>
          body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh;}
          .ticket-container { background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px; width: 100%; }
          h1 { color: #4CAF50; text-align: center; margin-bottom: 25px; font-size: 2em; }
          .ticket-info p { font-size: 1.1em; margin: 12px 0; padding-bottom: 12px; border-bottom: 1px solid #eee; }
          .ticket-info p:last-child { border-bottom: none; }
          .ticket-info strong { color: #555; min-width: 150px; display: inline-block; }
          .status { font-weight: bold; }
          .status-INUSE { color: #2196F3; } /* Blue */
          .status-USED { color: #4CAF50; } /* Green */
          .status-CANCELLED { color: #f44336; } /* Red */
          .status-EXPIRED { color: #FF9800; } /* Orange */
          @media (max-width: 600px) {
            .ticket-container { margin: 10px; padding: 20px; }
            h1 { font-size: 1.8em; }
            .ticket-info p { font-size: 1em; }
            .ticket-info strong { min-width: 120px; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="ticket-container">
          <h1>รายละเอียดตั๋ว</h1>
          <div class="ticket-info">
            <p><strong>รหัสตั๋ว:</strong> ${ticketData.ticket_uuid}</p>
            <p><strong>วันที่และเวลา:</strong> ${formatThaiDateTime(ticketData.ticket_date, ticketData.ticket_time)}</p>
            <p><strong>ประเภทตั๋ว:</strong> ${ticketData.route_ticket_name_th || ticketData.ticket_type}</p>
            <p><strong>ราคา (หลังหักส่วนลด):</strong> ${ticketData.ticket_discount_price.toFixed(2)} บาท</p>
            <p><strong>สถานะ:</strong> <span class="status status-${ticketData.ticket_status}">${ticketData.ticket_status}</span></p>
            <p><strong>เส้นทาง:</strong> ${ticketData.start_location_name || 'N/A'} - ${ticketData.stop_location_name || 'N/A'}</p>
            <p><strong>สายรถ:</strong> ${ticketData.route_ticket?.route_ticket_name_th || 'N/A'}</p>
            <p><strong>หมายเหตุ:</strong> ${ticketData.ticket_note || '-'}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(htmlResponse);
  } catch (error) {
    if (error instanceof AppError) {
      // Send a simple HTML error page for user-facing errors
      const errorHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>เกิดข้อผิดพลาด</title>
        <style>
          body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; text-align: center; }
          .error-container { background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; width: 100%; }
          h1 { color: #f44336; }
        </style>
         <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="error-container">
          <h1>เกิดข้อผิดพลาด</h1>
          <p>${error.message}</p>
          <p><a href="javascript:history.back()">กลับไปหน้าก่อนหน้า</a></p>
        </div>
      </body>
      </html>`;
      res.setHeader("Content-Type", "text/html");
      res.status(error.statusCode).send(errorHtml);
    } else {
      // For internal server errors, log and send a generic HTML error
      console.error("Internal Server Error:", error);
      const internalErrorHtml = `
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>เกิดข้อผิดพลาด</title>
         <style>
          body { font-family: 'Sarabun', sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; text-align: center; }
          .error-container { background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; width: 100%; }
          h1 { color: #f44336; }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="error-container">
          <h1>เกิดข้อผิดพลาดภายในระบบ</h1>
          <p>ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้งในภายหลัง</p>
        </div>
      </body>
      </html>`;
      res.setHeader("Content-Type", "text/html");
      res.status(500).send(internalErrorHtml);
    }
  }
}
}