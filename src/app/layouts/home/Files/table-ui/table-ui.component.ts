import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TablesService } from 'src/app/services/Files/tables.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Files.UI TableUI: generates "<TableSuffix> <n>" tables in one go.
@Component({
  selector: 'app-table-ui',
  templateUrl: './table-ui.component.html',
  styleUrls: ['./table-ui.component.css']
})
export class TableUIComponent implements OnInit {
  tableForm       : FormGroup;
  tableCategorys  : any[] = [];
  multipleTable   : boolean = false;
  isSaving        : boolean = false;

  constructor(
    private fb                  : FormBuilder,
    private tablesService       : TablesService,
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<TableUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  async ngOnInit(): Promise<void> {
    this.multipleTable = this.data[0];
    this.tableForm = this.fb.group({
      TableCategory : [{ value: this.multipleTable ? (this.data[1] != 'All' ? this.data[1] : null) : 'NA', disabled: !this.multipleTable }, this.multipleTable ? Validators.required : null],
      TableSuffix   : ['', Validators.required],
      StartCount    : [1, [Validators.required, Validators.min(0)]],
      NoOfTables    : [1, [Validators.required, Validators.min(1), Validators.max(500)]],
    });
    if (this.multipleTable)
      this.tableCategorys = await firstValueFrom(this.tablesService.getTableCategorys());
  }

  get previewNames(): string {
    var form = this.tableForm?.getRawValue();
    if (!form || !form.TableSuffix || form.NoOfTables < 1) return '';
    var start = +form.StartCount;
    var count = +form.NoOfTables;
    var last = start + count - 1;
    return count > 1 ? form.TableSuffix + ' ' + start + ' ... ' + form.TableSuffix + ' ' + last : form.TableSuffix + ' ' + start;
  }

  onSubmit(){
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return this.notificationService.toastrWarning('Empty Field.');
    }
    this.isSaving = true;
    this.tablesService.generateTables(this.tableForm.getRawValue()).subscribe({
      next:(res) => {
        this.isSaving = false;
        this.notificationService.toastrSuccess(res.message);
        this.tableForm.patchValue({ TableSuffix: '', StartCount: 1, NoOfTables: 1 });
      },
      error:(err) => {
        this.isSaving = false;
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}
