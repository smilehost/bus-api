import { member } from "@prisma/client";
import { AppError } from "../../../utils/appError";
import { Util } from "../../../utils/util";
import { CompanyRepository } from "../company/companyRepository";
import { MemberRepository } from "./memberRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  async getAll(comId: number) {
    return this.memberRepository.getAll(comId);
  }

  async getById(comId: number, memberId: number) {
    const member = await this.memberRepository.getById(memberId);
    if (!member) {
      throw AppError.NotFound("Member not found");
    }

    if (!Util.ValidCompany(comId, member.member_com_id)) {
      throw AppError.Forbidden("Member: Company ID does not match");
    }

    return member;
  }

  async create(comId: number, data: member) {
    const company = await this.companyRepository.getById(data.member_com_id);
    if (!company) {
      throw AppError.NotFound("Company not found");
    }

    return this.memberRepository.create(data);
  }

  async update(comId: number, memberId: number, data: member) {
    const company = await this.companyRepository.getById(data.member_com_id);
    if (!company) {
      throw AppError.NotFound("Company not found");
    }

    const existing = await this.memberRepository.getById(memberId);
    if (!existing) {
      throw AppError.NotFound("Member not found");
    }

    if (!Util.ValidCompany(comId, existing.member_com_id)) {
      throw AppError.Forbidden("Member: Company ID does not match");
    }

    return this.memberRepository.update(memberId, data);
  }

  async delete(comId: number, memberId: number) {
    const existing = await this.memberRepository.getById(memberId);
    if (!existing) {
      throw AppError.NotFound("Member not found");
    }

    if (!Util.ValidCompany(comId, existing.member_com_id)) {
      throw AppError.Forbidden("Member: Company ID does not match");
    }

    return this.memberRepository.delete(memberId);
  }
}
