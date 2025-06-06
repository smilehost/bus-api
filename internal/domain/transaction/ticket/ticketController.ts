// path: internal/controller/ticketController.ts
import { Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { AppError } from "../../../utils/appError";
import { ExceptionHandler } from "../../../utils/exception";
import { Util } from "../../../utils/util";
import { TicketService } from "./ticketService";


@autoInjectable()
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  async getByPagination(req: Request, res: Response) {
    try {
      const { com_id, query } = Util.extractRequestContext<
        void,
        void,
        { page: number; size: number; search: string; status: string }
      >(req, { query: true });

      const result = await this.ticketService.getByPagination(
        com_id,
        query.page,
        query.size,
        query.search,
        query.status
      );

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
      } else {
        ExceptionHandler.internalServerError(res, error);
      }
    }
  }

  async cancelTicket(req: Request, res: Response) {
    try {
      const { com_id, body } = Util.extractRequestContext<{
        ticket_uuid: string;
        ticket_note: string;
      }>(req, { body: true });

      const result = await this.ticketService.cancelTicket(
        body.ticket_uuid,
        body.ticket_note
      );
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
      } else {
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
          const [hours, minutes] = timeString.split(":");
          date.setHours(parseInt(hours, 10));
          date.setMinutes(parseInt(minutes, 10));

          return new Intl.DateTimeFormat("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Bangkok",
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
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ข้อมูลตั๋ว</title>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Sarabun', sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f2f2f2;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .ticket-container {
      background-color: #ffffff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
      max-width: 720px;
      width: 100%;
    }

    h1 {
      color: #2E7D32;
      text-align: center;
      margin-bottom: 32px;
      font-size: 2.2em;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    td {
      padding: 14px 10px;
      vertical-align: top;
    }

    td.label {
      font-weight: 600;
      color: #555;
      width: 40%;
      white-space: nowrap;
    }

    td.value {
      border-bottom: 1px solid #e0e0e0;
    }

    tr:last-child td.value {
      border-bottom: none;
    }

    .status {
      font-weight: bold;
    }

    .status-INUSE { color: #1976D2; }
    .status-USED { color: #388E3C; }
    .status-CANCELLED { color: #D32F2F; }
    .status-EXPIRED { color: #F57C00; }

    .footer-note {
      margin-top: 24px;
      font-size: 0.95em;
      color: #666;
      text-align: right;
      font-style: italic;
    }

    @media (max-width: 600px) {
      .ticket-container {
        padding: 20px;
        margin: 12px;
      }

      h1 {
        font-size: 1.6em;
      }

      td.label {
        width: 35%;
      }
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <h1>รายละเอียดตั๋ว</h1>
    <table>
      <tr>
        <td class="label">รหัสตั๋ว:</td>
        <td class="value">${ticketData.ticket_uuid}</td>
      </tr>
      <tr>
        <td class="label">วันที่และเวลา:</td>
        <td class="value">${formatThaiDateTime(
          ticketData.ticket_date,
          ticketData.ticket_time
        )}</td>
      </tr>
      <tr>
        <td class="label">ประเภทตั๋ว:</td>
        <td class="value">${
          ticketData.route_ticket_name_th || ticketData.ticket_type
        }</td>
      </tr>
      <tr>
        <td class="label">ราคา:</td>
        <td class="value">${ticketData.ticket_price} บาท</td>
      </tr>
      <tr>
        <td class="label">สถานะ:</td>
        <td class="value"><span class="status status-${
          ticketData.ticket_status
        }">${ticketData.ticket_status}</span></td>
      </tr>
      <tr>
        <td class="label">เส้นทาง:</td>
        <td class="value">${ticketData.start_location_name ?? "N/A"} - ${
        ticketData.stop_location_name ?? "N/A"
      }</td>
      </tr>
      <tr>
        <td class="label">สายรถ:</td>
        <td class="value">${
          ticketData.route_ticket?.route_ticket_name_th ?? "N/A"
        }</td>
      </tr>
      <tr>
        <td class="label">หมายเหตุ:</td>
        <td class="value">${ticketData.ticket_note || "-"}</td>
      </tr>
    </table>
    <div class="footer-note">* ราคา = ราคาหลังหักส่วนลดแล้ว</div>
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
