import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanvassDetailsService {
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

  getCanvassDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsByTransCode/'+transCode, this.BranchId );
  }
  getCanvassDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailById/'+id, this.BranchId );
  }
  updateCanvassDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateCanvassDetail/'+action,data, this.BranchId );
  }
  getCanvassDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getCanvassDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsByTransNo/'+transNo, this.BranchId );
  }
  getCanvassDetailsByTransNoForApproval(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsByTransNoForApproval/'+transNo, this.BranchId );
  }
  getCanvassDetailsWithCanvassDetailSuppliersByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsWithCanvassDetailSuppliersByTransNo/'+transNo, this.BranchId );
  }
  getCanvassDetailsWithCanvassDetailSuppliersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsWithCanvassDetailSuppliersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getCanvassDetailsReportByYearByReason(year,reason ) : Observable<any>{
    return this.http.get<any>(_url+'getCanvassDetailsReportByYearByReason/'+year+'/'+reason, this.BranchId );
  }
  updateCanvassDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateCanvassDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
}
