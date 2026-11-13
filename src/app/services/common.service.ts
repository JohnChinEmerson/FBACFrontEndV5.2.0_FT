import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import * as CryptoJS from 'crypto-js';

import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  CommonTransaction(): boolean {
    var accessRight = this.authService.UserAccount?.AccessRightName?.toLowerCase();

    if (accessRight === 'commonadmin') {
      this.notificationService.toastrWarning('Common Admin has viewing and editing access only. Transaction actions are not allowed.');
      return false;
    }
    return true;
  }

}