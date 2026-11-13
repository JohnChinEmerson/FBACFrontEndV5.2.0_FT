import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdjustingEntryDetailsService {

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

    getAdjustingEntryDetailById(id) : Observable<any>{
      return this.http.get<any>(_url+'getAdjustingEntryDetailById/'+id, this.BranchId );
    }
    updateAdjustingEntryDetail(data, action) : Observable<any>{
      return this.http.post<any>(_url+'updateAdjustingEntryDetail/'+action,data, this.BranchId );
    }
    getAdjustingEntryDetailsByDateFromByDateTo(dateFrom, dateTo) : Observable<any>{
      return this.http.get<any>(_url+'getAdjustingEntryDetailsByDateFromByDateTo/'+dateFrom+'/'+dateTo, this.BranchId );
    }
    getAdjustingEntryDetailsByReferenceNo(referenceNo) : Observable<any>{
      return this.http.get<any>(_url+'getAdjustingEntryDetailsByReferenceNo/'+referenceNo, this.BranchId );
    }
    getAdjustingEntryDetailsForSalesReturnByDateFromByDateToByCustomerIdWDate(dateFrom, dateTo, customerId, withDate) : Observable<any>{
      return this.http.get<any>(_url+'getAdjustingEntryDetailsForSalesReturnByDateFromByDateToByCustomerIdWDate/'+dateFrom+'/'+dateTo+'/'+customerId+'/'+withDate, this.BranchId );
    }
    
}
