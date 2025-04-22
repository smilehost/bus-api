export class Util {
  static ValidCompany(
    com_id1: number | undefined | null,
    com_id2: number | undefined | null
  ): boolean {
    // ❌ ตรวจว่ามีอันใดอันหนึ่งเป็น null หรือ undefined หรือไม่ใช่ตัวเลข
    if (
      com_id1 === null ||
      com_id1 === undefined ||
      isNaN(com_id1) ||
      com_id2 === null ||
      com_id2 === undefined ||
      isNaN(com_id2)
    ) {
      return false;
    }

    // ✅ ตรวจว่าทั้งคู่เท่ากัน
    return com_id1 === com_id2;
  }
}
