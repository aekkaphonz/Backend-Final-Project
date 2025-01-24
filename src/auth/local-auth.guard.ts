import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
 async canActivate(context: ExecutionContext){
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    if (request.user) {
      request.session.user = {
        email: request.user.email,
       
      };
    }

    
    return result;
 }
 
}
