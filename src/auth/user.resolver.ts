import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { CurrentUser } from './current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuardJWTGql } from './auth-guard.jwt.gql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJWTGql)
  public async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
