import { PrismaClient } from "@prisma/client";
import { GetRemainByRouteTimeDTO } from "../cmd/dto";
import { RouteTimeRepository } from "../internal/domain/route/routeTime/routeTimeRepository";
import { TicketRemainRepository } from "../internal/domain/transaction/ticketRemain/ticketRemainRepository";
import { TicketRemainService } from "../internal/domain/transaction/ticketRemain/ticketRemainService";


// 1. สร้าง Prisma instance
const prisma = new PrismaClient();

// 2. สร้าง Repository และ Service
const ticketRemainRepo = new TicketRemainRepository(prisma);
const routeTimeRepo = new RouteTimeRepository(prisma);
const ticketRemainService = new TicketRemainService(
  ticketRemainRepo,
  routeTimeRepo
);

// 3. สร้าง input DTO
const input: GetRemainByRouteTimeDTO = {
  ticket_id: 1,
  ticket_remain_date: "2025-05-08",
  // ticket_remain_time: "08:00,09:00,10:00",
  route_time_id: 1,
};

// 4. ทดสอบฟังก์ชัน
(async () => {
  try {
    const result = await ticketRemainService.getRemainByRouteTime(input);
    console.log("✅ ticket_remain result:");
    console.dir(result, { depth: null });
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
