import { MemberService } from "./memberService";


export class MemberController {
  constructor(private readonly memberService: MemberService) {}
}
