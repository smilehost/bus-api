import { autoInjectable } from "tsyringe";
import { MemberService } from "./memberService";


@autoInjectable()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
}
