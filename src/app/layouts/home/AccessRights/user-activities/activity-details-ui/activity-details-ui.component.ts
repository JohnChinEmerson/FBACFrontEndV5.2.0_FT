import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { UserActivitiesService } from 'src/app/services/User/user-activities.service';

// Double-click on a User Activities row that has no details dialog of its own (a file record, a cash drawer,
// a voucher, a login, a print ...): the activity, the record as it is now and everything that happened to it.
// data = [row, branchId of the list, row is in the branch of the login]
@Component({
  selector: 'app-activity-details-ui',
  templateUrl: './activity-details-ui.component.html',
  styleUrls: ['./activity-details-ui.component.css']
})
export class ActivityDetailsUIComponent implements OnInit {
  row         : any;
  branchId    : any;
  sameBranch  : boolean = true;
  fields      : { label: string, value: any }[] = [];
  record      : { label: string, value: any }[] = null;
  events      : any[] = [];
  isLoading   : boolean = false;
  message     : string = '';

  // bookkeeping columns of a record that tell the person nothing
  private hiddenFields = ['id', 'created_at', 'updated_at', 'Password', 'remember_token'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userActivitiesService : UserActivitiesService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.row        = this.data[0];
    this.branchId   = this.data[1];
    this.sameBranch = this.data[2];
    this.fields = [
      { label: 'Date',          value: this.row.TransDate },
      { label: 'Time',          value: this.row.TransTime },
      { label: 'User',          value: this.row.FullName },
      { label: 'Access Right',  value: this.row.AccessRight },
      { label: 'Module',        value: this.row.Module },
      { label: 'Action',        value: this.row.Action },
      { label: 'Reference No',  value: this.row.RefNo },
      { label: 'Party',         value: this.row.Party },
      { label: 'Amount',        value: this.row.Amount },
      { label: 'Status',        value: this.row.RecordStatus },
      { label: 'Details',       value: this.row.Subject },
    ].filter(f => f.value !== null && f.value !== undefined && f.value !== '');

    if(this.row.TransType && this.row.RefNo)
      await this.loadTrail();
  }

  async loadTrail(){
    this.isLoading = true;
    try {
      const trail = await firstValueFrom(this.userActivitiesService.getActivityTrail(this.row.TransType, this.row.RefNo, this.branchId, this.row.RecordId));
      this.events = trail.events ?? [];
      this.record = trail.record
        ? Object.keys(trail.record)
            .filter(k => !this.hiddenFields.includes(k) && trail.record[k] !== null && trail.record[k] !== '')
            .map(k => ({ label: k, value: trail.record[k] }))
        : null;
      if(!this.record)
        this.message = 'This record no longer exists.';
    } catch {
      this.message = 'The record could not be loaded.';
    } finally {
      this.isLoading = false;
    }
  }
}
