import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-upload-customers-uicomponent',
  templateUrl: './upload-customers-uicomponent.component.html',
  styleUrls: ['./upload-customers-uicomponent.component.css']
})
export class UploadCustomersUIComponentComponent implements OnInit {

  file: File;
  data: any;
  loading : boolean = false;
  btnText: string = 'Upload';
  totalCustomers: number = 0;
  uploadedCount: number = 0;
  progress: number = 0;
  constructor(
    private customersService :CustomersService,
    private notif : NotificationService,
    private dialogRef : MatDialogRef<UploadCustomersUIComponentComponent>
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

  async uploadCustomers() {
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
      this.totalCustomers = rows.length;
      this.uploadedCount = 0;
      this.progress = 0;
      this.loading = true;
      this.btnText = 'Uploading...';
      let success = true; // Track success status
      for (const row of rows) {
        const rowData: any = {};

        //set default once
        rowData['CustomerId'] = 'generated';
        rowData['BusinessStyle'] = '-';
        rowData['TermDays'] = 0;
        rowData['PriceCategory'] = 'Regular Price';
        rowData['HasRebate'] = 'no';
        rowData['IdPresented'] = '-';
        rowData['DiscountId'] = '-';
        rowData['DiscountPerson'] = 'No Discount';
        rowData['DiscountPercent'] = 0;
        rowData['BeginningRebate'] = 0;

        // now fill from Excel
        columns.forEach((column, index) => {
          rowData[column] = row[index];
        });

        if (rowData.CustomerName == '' || rowData.CustomerName == null || rowData.CustomerName == undefined) {
          break;
        }

        try {
          const res = await this.customersService.saveEditCustomers(rowData, 'save').toPromise();
          this.uploadedCount++;
          this.progress = Math.round((this.uploadedCount / this.totalCustomers) * 100);
        } catch (err) {
          success = false;
          this.notif.toastrError(rowData.CustomerName + ' - ' + err.error.message);
          break; 
        }
      }
  
      if (success) {
        this.loading = false;
        this.btnText = 'Upload';
        this.notif.toastrSuccess('All customers uploaded successfully!');
        this.dialogRef.close();
      }
    
    };
  
    reader.readAsBinaryString(this.file);
  }
}
