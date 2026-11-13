import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileConfigsService {

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

  getFileConfig() : Observable<any>{
    return this.http.get<any>(_url+'getFileConfig',this.BranchId);
  }

  updateFileConfig(data: any) : Observable<any>{
    return this.http.post<any>(_url+'updateFileConfig',data, this.BranchId);
  }
}
