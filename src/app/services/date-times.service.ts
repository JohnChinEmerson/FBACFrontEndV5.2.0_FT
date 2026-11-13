import { DatePipe, formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimesService {

  constructor(
    private datePipe        : DatePipe,
  ) { }

  ConvertToDateFormat(date:Date)
  {
    const parsedDateFrom = new Date(date);
    var dateFrom =  this.datePipe.transform(parsedDateFrom, 'yyyy-MM-dd') || '';
    return dateFrom;
  }

  ConvertToDateTimeFormat(date:Date)
  {
    return formatDate(date,"yyyy-MM-dd HH:mm:ss","en-US");
  }

  getMonthName(monthNumber: any): string {
    const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1]; 
  }

  getYears(){
    return ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
  }

  getMonths(){
    var months:any = [
      {
        'Label' : 'January',
        'Value' : '1',
      },
      {
        'Label' : 'February',
        'Value' : '2',
      },
      {
        'Label' : 'March',
        'Value' : '3',
      },
      {
        'Label' : 'April',
        'Value' : '4',
      },
      {
        'Label' : 'May',
        'Value' : '5',
      },
      {
        'Label' : 'June',
        'Value' : '6',
      },
      {
        'Label' : 'July',
        'Value' : '7',
      },
      {
        'Label' : 'August',
        'Value' : '8',
      },
      {
        'Label' : 'September',
        'Value' : '9',
      },
      {
        'Label' : 'October',
        'Value' : '10',
      },
      {
        'Label' : 'November',
        'Value' : '11',
      },
      {
        'Label' : 'Decemeber',
        'Value' : '12',
      },
    ];

    return months;
 
  }

  sort(data, column) {
      data.sort((a, b) => new Date(a[column]).getTime() - new Date(b[column]).getTime());
  }
}
