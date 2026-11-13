import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseHeadersService {

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

  getExpenseHeaderByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseHeaderByTransCode/'+transCode, this.BranchId );
  }
  getExpenseHeaderByRecordStatusByInputBy(recordStatus, inputBy) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseHeaderByRecordStatusByInputBy/'+recordStatus+'/'+inputBy, this.BranchId );
  }
  getExpenseHeaderByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseHeaderByTransNo/'+transNo, this.BranchId );
  }
  getExpenseHeadersByRecordStatus(recordStatus) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseHeadersByRecordStatus/'+recordStatus, this.BranchId );
  }
  getExpenseHeaderComputedAmounts(data) : Observable<any>{
    return this.http.post<any>(_url+'getExpenseHeaderComputedAmounts',data, this.BranchId );
  }
  updateExpenseHeader(transCode, totalAmount, recordStatus, action,saleHeaderForm) : Observable<any>{
    return this.http.post<any>(_url+'updateExpenseHeader/'+transCode+'/'+totalAmount+'/'+recordStatus+'/'+action,saleHeaderForm, this.BranchId );
  }
  getExpenseHeadersByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseHeadersByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  updateExpenseRecordStatus(transNo, action) : Observable<any>{
    return this.http.get<any>(_url+'updateExpenseRecordStatus/'+transNo+'/'+action, this.BranchId );
  }
}
