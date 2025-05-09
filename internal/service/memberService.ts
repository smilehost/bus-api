import { MemberRepository } from "../repository/memberRepository";

export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository
  ) {}
  
}
