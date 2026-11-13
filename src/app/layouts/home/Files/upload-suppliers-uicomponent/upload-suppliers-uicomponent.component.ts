import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SuppliersService } from 'src/app/services/Files/suppliers.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-upload-suppliers-uicomponent',
  templateUrl: './upload-suppliers-uicomponent.component.html',
  styleUrls: ['./upload-suppliers-uicomponent.component.css']
})
export class UploadSuppliersUIComponentComponent implements OnInit {

file: File;
  data: any;
  loading : boolean = false;
  btnText: string = 'Upload';
  totalSuppliers: number = 0;
  uploadedCount: number = 0;
  progress: number = 0;
  constructor(
    private suppliersService :SuppliersService,
    private notif : NotificationService,
    private dialogRef : MatDialogRef<UploadSuppliersUIComponentComponent>
  ) { }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      this.file = files[0];
    }
  }

  async uploadSuppliers() {
    if (!this.file) {
      return this.notif.toastrError('Please select a file.');
    }
  
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      this.data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const columns = this.data[0];
      const rows = this.data.slice(1);
      this.totalSuppliers = rows.length;
      this.uploadedCount = 0;
      this.progress = 0;
      this.loading = true;
      this.btnText = 'Uploading...';
      let success = true; // Track success status
      for (const row of rows) {
        const rowData: any = {};
        
        //set default once
        rowData['SupplierId'] = 'generated';
        rowData['BusinessStyle'] = '-';
        rowData['ContactPerson'] = '-';
        rowData['TermDays'] = 0;

        // now fill from Excel
        columns.forEach((column, index) => {
          rowData[column] = row[index];
        });

        if (rowData.SupplierName == '' || rowData.SupplierName == null || rowData.SupplierName == undefined) {
          break;
        }

        try {
          const res = await this.suppliersService.saveEditSuppliers(rowData, 'save').toPromise();
          this.uploadedCount++;
          this.progress = Math.round((this.uploadedCount / this.totalSuppliers) * 100);
        } catch (err) {
          success = false;
          this.notif.toastrError(rowData.SupplierName + ' - ' + err.error.message);
          break; 
        }
      }
  
      if (success) {
        this.loading = false;
        this.btnText = 'Upload';
        this.notif.toastrSuccess('All suppliers uploaded successfully!');
        this.dialogRef.close();
      }
    
    };
  
    reader.readAsBinaryString(this.file);
  }

}
