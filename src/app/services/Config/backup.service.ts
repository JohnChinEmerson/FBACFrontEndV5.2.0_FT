import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
 
  private _refreshrequired = new Subject<void>();
 
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`,
    'UserId': `${this.auth.LoginId}`,
    'Edition': `${this.auth.Edition}`,
    'Token': `${localStorage.getItem('SessionToken')}`
  });
 
  BranchId: any;
 
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private toolBoxService: ToolBoxService,
  ) {
    this.BranchId = { headers: this.branch };
  }
 
  get requiredRefresh() {
    return this._refreshrequired;
  }
 
  getBackupsByTransDateFromByTransDateTo(transDateFrom: any, transDateTo: any): Observable<any> {
    return this.http.get<any>(
      _url + 'getBackupsByTransDateFromByTransDateTo/' + transDateFrom + '/' + transDateTo,
      this.BranchId
    );
  }
 
  downloadBackup(filename: string): Observable<Blob> {
    return this.http.get(
      _url + 'downloadBackup/' + filename,
      {
        headers: this.branch,
        responseType: 'blob'
      }
    );
  }
 
  backupDatabase(): Observable<any> {
    return this.http.get<any>(
      _url + 'backupDatabase',
      this.BranchId
    );
  }
}