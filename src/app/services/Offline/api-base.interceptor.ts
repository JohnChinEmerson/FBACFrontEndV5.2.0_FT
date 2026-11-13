import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { ApiTargetService } from './api-target.service';

// Services build URLs as _url + 'endpoint'. This swaps the _url prefix for the
// active backend (cloud or branch server) so no service has to change.
@Injectable()
export class ApiBaseInterceptor implements HttpInterceptor {

  constructor(private apiTarget: ApiTargetService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const base = this.apiTarget.baseUrl;
    if (base && base !== _url && req.url.startsWith(_url)) {
      req = req.clone({ url: base + req.url.substring(_url.length) });
    }
    return next.handle(req);
  }
}
