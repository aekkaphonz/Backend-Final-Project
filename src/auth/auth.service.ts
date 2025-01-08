import { Injectable } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    console.log('user', user);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user.toObject();
   
      return {
        email: result.email,
        userId : result._id,
      };
    }

    return null;
  }
}
