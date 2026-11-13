import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ItemsService } from 'src/app/services/Files/items.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as XLSX from 'xlsx';

// Desktop UploadExcelFileUI (Upload Items): the items template (.xls / .xlsx) has one sheet per item type and a
// Costing sheet. Every sheet is sent once to the server, which checks all rows (CHECK FILE: what will be added,
// skipped and the errors by sheet / row / column) and then saves everything in one transaction (UPLOAD).
@Component({
  selector: 'app-upload-items-uicomponent',
  templateUrl: './upload-items-uicomponent.component.html',
  styleUrls: ['./upload-items-uicomponent.component.css']
})
export class UploadItemsUIComponentComponent implements OnInit {
  readonly templateUrl = '/assets/files/items_template.xls';
  file    : File = null;
  sheets  : any[] = null;
  summary : any = null;
  loading : boolean = false;
  status  : string = '';

  constructor(
    private itemsService :ItemsService,
    private notif : NotificationService,
    private dialogRef : MatDialogRef<UploadItemsUIComponentComponent>
  ) { }

  ngOnInit(): void {
  }

  get canUpload(): boolean {
    return !!this.summary && this.summary.errors == 0 && (this.summary.add + this.summary.components) > 0 && !this.loading;
  }

  async onFileChange(event: any) {
    const files = (event.target as HTMLInputElement).files;
    this.file = files && files.length > 0 ? files[0] : null;
    this.sheets = null;
    this.summary = null;
    if (this.file) await this.onClickCheck();
  }

  private readWorkbook(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
          // all sheets, cells by position (blank rows kept: the Desktop stops a sheet at the first one)
          resolve(workbook.SheetNames.map(name => ({
            name,
            rows: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, raw: true, defval: null, blankrows: true }),
          })));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  async onClickCheck() {
    if (!this.file) return this.notif.toastrWarning('Please select a file.');
    this.loading = true;
    this.status = 'Checking...';
    try {
      this.sheets = this.sheets || await this.readWorkbook(this.file);
      this.summary = await firstValueFrom(this.itemsService.uploadItems(this.sheets, false));
      if (this.summary.errors > 0)
        this.notif.toastrWarning(this.summary.errors + ' error(s) found. Fix them in the file, then select it again.');
    } catch (err: any) {
      this.summary = null;
      this.notif.toastrError(this.notif.httpErrorMessage(err, 'The file could not be read. Use the items template (.xls or .xlsx).'));
    } finally {
      this.loading = false;
      this.status = '';
    }
  }

  async onClickUpload() {
    if (!this.canUpload) return;
    this.loading = true;
    this.status = 'Uploading...';
    try {
      const res: any = await firstValueFrom(this.itemsService.uploadItems(this.sheets, true));
      this.notif.toastrSuccess(res.message || 'Successfully Uploaded.');
      this.dialogRef.close(true);
    } catch (err: any) {
      if (err?.error?.issues) this.summary = err.error;
      this.notif.toastrError(this.notif.httpErrorMessage(err, 'Nothing was uploaded.'));
    } finally {
      this.loading = false;
      this.status = '';
    }
  }

  trackByIndex(index: number) {
    return index;
  }
}
