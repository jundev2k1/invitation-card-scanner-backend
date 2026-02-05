import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('User - Client')
@Controller('api/users')
export class UserClientController {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }
}