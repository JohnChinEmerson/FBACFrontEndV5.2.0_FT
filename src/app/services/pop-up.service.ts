import { DatePipe } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',     
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`,
     'UserId': `${this.auth.LoginId}`,
    'Edition': `${this.auth.Edition}`,
     
    'Token': `${localStorage.getItem('SessionToken')}`
  });

  BranchId : any;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { 
    this.BranchId ={ headers: this.branch};
    
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }

  GetPopUps()
  {
    return this.http.get(_url+'GetPopUps', this.BranchId);
  }
}
