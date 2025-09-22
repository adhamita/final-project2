import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Header Interceptor');
  
  return next(req);
};
