import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: User) => void) {
    done(null, user);
  }
  deserializeUser(payload: any, done: (err: Error, payload: any) => void) {
    done(null, payload);
  }
}
