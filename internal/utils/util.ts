export class Util {
  static ValidCompany(
    com_id1: number | undefined | null,
    com_id2: number | undefined | null
  ): boolean {
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
    return com_id1 === com_id2;
  }

  static parseId(input: unknown): number | null {
    if (input === null || input === undefined) return null;

    if (Array.isArray(input)) {
      input = input[0]; // ถ้ามีหลายค่า เอาค่าแรก
    }

    if (typeof input === "number") {
      return isNaN(input) ? null : input;
    }

    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed === "") return null;

      const parsed = parseInt(trimmed, 10);
      return isNaN(parsed) ? null : parsed;
    }

    return null; // ไม่ใช่ string หรือ number
  }

  static checkObjectHasMissingFields(obj: Record<string, any>): {
    valid: boolean;
    missing: string[];
  } {
    const missing = Object.keys(obj).filter((key) => {
      const value = obj[key];
      return value === undefined || value === null || value === "";
    });

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}
