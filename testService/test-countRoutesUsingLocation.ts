import { PrismaClient } from "@prisma/client";
import { RouteRepository } from "../internal/repository/routeRepository";
import { RouteService } from "../internal/service/routeService";
import { RouteDateRepository } from "../internal/repository/routeDateRepository";
import { RouteTimeRepository } from "../internal/repository/routeTimeRepository";
import { RouteLocationRepository } from "../internal/repository/routeLocationRepository";

// 1. สร้าง Prisma instance
const prisma = new PrismaClient();

// 2. สร้าง Repository
const routeRepo = new RouteRepository(prisma);
const routeDateRepo = new RouteDateRepository(prisma);
const routeTimeRepo = new RouteTimeRepository(prisma);
const routeLocationRepo = new RouteLocationRepository(prisma);
// 3. สร้าง Service
const routeService = new RouteService(
  routeRepo,
  routeDateRepo,
  routeLocationRepo
);

// 4. ใส่ com_id และ location_id ที่จะใช้ทดสอบ
const com_id = 1;
const location_id = 2;

// 5. ทดสอบฟังก์ชัน
(async () => {
  try {
    const routes = await routeService.getRoutesUsingLocation(
      com_id,
      location_id
    );
    console.log(
      `✅ พบ ${routes.length} route(s) ที่อ้างถึง location_id = ${location_id}`
    );
    console.log(routes); // แสดงตาราง route_id, route_name_th, route_array
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
