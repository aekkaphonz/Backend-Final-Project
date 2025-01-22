import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';


@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    // console.log('Authenticated user in guard:', request.user);
    console.log('Session:', request.session); 
    console.log('User from req.user:', request.user);
    return request.isAuthenticated();
  }
}
