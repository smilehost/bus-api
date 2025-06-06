import { PrismaClient } from "@prisma/client";
import { MemberService } from "../internal/domain/company/member/memberService";
import { CompanyRepository } from "../internal/domain/company/company/companyRepository";
import { MemberRepository } from "../internal/domain/company/member/memberRepository";

// ✅ สร้าง Prisma instance
const prisma = new PrismaClient();

// ✅ สร้าง Repository
const memberRepo = new MemberRepository(prisma);
const companyRepo = new CompanyRepository(prisma);

// ✅ สร้าง Service
const memberService = new MemberService(memberRepo, companyRepo);

// ✅ ข้อมูลสำหรับทดสอบ
const com_id = 1;

const mockMember = {
  member_com_id: com_id,
  member_phone: "0812345678",
  member_date_time: new Date(),
};

(async () => {
  try {
    // ✅ CREATE
    console.log("🔄 เริ่มสร้างสมาชิก...");
    const created = await memberService.create(com_id, {
      member_id: 0, // Prisma จะ ignore
      ...mockMember,
    });
    console.log("✅ สร้างสำเร็จ:", created);

    // ✅ GET ALL
    console.log("\n📦 ดึงทั้งหมด...");
    const all = await memberService.getAll(com_id);
    console.log(`✅ พบทั้งหมด ${all.length} รายการ`);

    // ✅ GET BY ID
    const targetId = created.member_id;
    console.log(`\n🔍 ดึงด้วย ID = ${targetId}`);
    const member = await memberService.getById(com_id, targetId);
    console.log("✅ ข้อมูลสมาชิก:", member);

    // ✅ UPDATE
    console.log(`\n✏️ อัปเดตหมายเลขโทรศัพท์ของสมาชิก ${targetId}...`);
    const updated = await memberService.update(com_id, targetId, {
      ...member,
      member_phone: "0998765432",
    });
    console.log("✅ อัปเดตสำเร็จ:", updated);

    // ✅ DELETE
    console.log(`\n🗑 ลบสมาชิก ${targetId}...`);
    await memberService.delete(com_id, targetId);
    console.log("✅ ลบสำเร็จ");

    // ✅ ตรวจสอบการลบ
    try {
      await memberService.getById(com_id, targetId);
    } catch (err) {
      console.log(
        "✅ ยืนยันแล้วว่าสมาชิกถูกลบเรียบร้อย:",
        (err as Error).message
      );
    }
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
