import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDetailsService {

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

  getExpenseDetailsByTransCode(transCode) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseDetailsByTransCode/'+transCode, this.BranchId );
  }
  getExpenseDetailById(id) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseDetailById/'+id, this.BranchId );
  }
  updateExpenseDetail(data, action) : Observable<any>{
    return this.http.post<any>(_url+'updateExpenseDetail/'+action,data, this.BranchId );
  }
  computeExpenseDetailAmount(price, discountValue, discountType, vATType) : Observable<any>{
    return this.http.get<any>(_url+'computeExpenseDetailAmount/'+price+'/'+discountValue+'/'+discountType+'/'+vATType, this.BranchId );
  }
  getExpenseDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
  }
  getExpenseDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getExpenseDetailsByTransNo/'+transNo, this.BranchId );
  }
  getOpenExpenseDetailsByTransNo(transNo) : Observable<any>{
    return this.http.get<any>(_url+'getOpenExpenseDetailsByTransNo/'+transNo, this.BranchId );
  }
  updateExpenseDetailRecordStatus(id, action) : Observable<any>{
    return this.http.get<any>(_url+'updateExpenseDetailRecordStatus/'+id+'/'+action, this.BranchId );
  }
}
