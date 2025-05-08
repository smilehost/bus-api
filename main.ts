import { PrismaClient } from "@prisma/client";
import { TicketRemainRepository } from "./internal/repository/ticketRemainRepository";
import { TicketRemainService } from "./internal/service/ticketRemainService";

// 1. เตรียม Prisma instance
const prisma = new PrismaClient();

// 2. สร้าง Repository และ Service
const ticketRemainRepo = new TicketRemainRepository(prisma);
const ticketRemainService = new TicketRemainService(ticketRemainRepo);

// 3. สร้าง input DTO
const input = {
  ticket_remain_date: "2025-05-08",
  ticket_remain_time: "08:00",
  ticket_remain_route_ticket_id: 1,
};

// 4. เรียก service โดยตรง
(async () => {
  try {
    const result = await ticketRemainService.getRemainNumber(input);
    console.log("✅ ticket_remain_number:", result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error:", error.message);
    } else {
      console.error("❌ Unexpected error:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
})();
