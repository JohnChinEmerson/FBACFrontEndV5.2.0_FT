import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanvassHeadersService {
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

  getCanvassHeaderByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassHeaderByTransCode/'+transCode, this.BranchId );
  }
  getCanvassHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  getCanvassHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassHeaderByTransNo/'+transNo, this.BranchId );
  }
  getCanvassHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }

  updateCanvassHeader(transCode,  action,canvassHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updateCanvassHeader/'+transCode+'/'+action,canvassHeaderForm, this.BranchId );
  }
  getCanvassHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updateCanvassRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateCanvassRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
  getCBOCanvassHeaderForApproval() : Observable<any>{
    return this.http.get<any>(_url+'getCBOCanvassHeaderForApproval', this.BranchId );
  }
  approveCanvassHeaderbyTransNo( transNo) : Observable<any>{
    return this.http.get<any>(_url+'approveCanvassHeaderbyTransNo/'+transNo, this.BranchId );
  }

  
}
