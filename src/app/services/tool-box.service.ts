import { DatePipe, formatDate } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ToolBoxService {
  branch = new HttpHeaders({
    'Content-Type'    : 'application/json',
    'AuthBranchId'   : `${this.authService.Branch ? this.authService.Branch.BranchId : ""}`,
    'UserId'          : `${this.authService.LoginId}`,
    'Edition': `${this.authService.Edition}`,
    'Token'           : `${localStorage.getItem('SessionToken')}`
  });

  BranchId : any;
  
  constructor(
    private authService     : AuthService,
    private router          : Router,

  ) { }

  updateAuthorizationHeader(BranchId: string) {
    this.branch = new HttpHeaders({
      'Content-Type': 'application/json',
      'AuthBranchId': `${BranchId ?? null}`,
      'UserId': `${this.authService.LoginId ?? null}`,
      'Edition': `${this.authService.Edition ?? null}`,
      'Token': `${localStorage.getItem('SessionToken') ?? null}`
    });
    this.BranchId ={ headers: this.branch};

    return this.BranchId;
  }

  onHome(){
    this.router.navigate(['/home']);
  }


  Serialized(){
    return true;
  }
  
  disableButtons(buttons1:any, buttons2:any, buttons3:any, buttons4:any){
    buttons1?.forEach(x => {
      x.Disabled = this.authService.HasButton(x.Label)
    });
    buttons2?.forEach(x => {
      x.Disabled = this.authService.HasButton(x.Label)
    });
    buttons3?.forEach(x => {
      x.Disabled = this.authService.HasButton(x.Label)
    });
    buttons4?.forEach(x => {
      x.Disabled = this.authService.HasButton(x.Label)
    });
  }

  getTotalQty(data){
    let sum = 0;

    if(data?.lenght > 0){
      data.forEach(x => {
        sum += x.Qty;
      });
    }
    return sum;
  }

  WithLogo(){
    return false;
  }
}
