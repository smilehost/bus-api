import { MemberService } from "../service/memberService";

export class MemberController {
  constructor(private readonly memberService: MemberService) {}
}
