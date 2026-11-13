import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PopupAccessRightsService {

  
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
  
    get RequiredRefresh(){
      return this._refreshrequired;
    }
  
    getPopupAccessRightsByPopupId(popupId) : Observable<any>{
      return this.http.get<any>(_url+'getPopupAccessRightsByPopupId/'+popupId, this.BranchId );
    }
    getPopupAccessRightsByUserId(userId) : Observable<any>{
      return this.http.get<any>(_url+'getPopupAccessRightsByUserId/'+userId, this.BranchId );
    }
    savePopupAccessRights(popupId, data) : Observable<any>{
      return this.http.post<any>(_url+'savePopupAccessRights/'+popupId,data, this.BranchId );
    }
    deletePopupAccessRights(data) : Observable<any>{
      return this.http.post<any>(_url+'deletePopupAccessRights',data, this.BranchId );
    }
}
