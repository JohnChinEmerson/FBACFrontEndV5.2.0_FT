import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DateZReadingsService {
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

  getDateZReadingsByTerminalByDate( terminal, date) : Observable<any>{
    return this.http.get<any>(_url+'getDateZReadingsByTerminalByDate/'+terminal+'/'+date, this.BranchId );
  }
  getDateZReadingsByDateFromByDateTo( dateFrom, dateTo, terminal) : Observable<any>{
    return this.http.get<any>(_url+'getDateZReadingsByDateFromByDateTo/'+dateFrom+'/'+dateTo+'/'+terminal, this.BranchId );
  }
  generateZReading( data,date) : Observable<any>{
    return this.http.post<any>(_url+'generateZReading/'+date,data, this.BranchId );
  }
  getLastZReading( terminal) : Observable<any>{
    return this.http.get<any>(_url+'getLastZReading/'+terminal, this.BranchId );
  }
  isZReadingClose( terminal, date) : Observable<any>{
    return this.http.get<any>(_url+'isZReadingClose/'+terminal+'/'+date, this.BranchId );
  }
}
