import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-customermanagment';
  displayedColumns: string[] = ['FirstName', 'Lastname', 'Email', 'Phone','action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor (private dialog: MatDialog, private api:ApiService){

  }
  ngOnInit(): void {
    this.getAllCustomers();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save')
      {
      this.getAllCustomers();
      }
    })
  }

  getAllCustomers(){
    this.api.getCustomerList()
    .subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort
      },
      error:(err)=>{
        alert("Error while fetching the records")
      }
    })
  }
  modifyCust(row : any)
  {
    this.dialog.open(DialogComponent,{ 
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update')
      {
        this.getAllCustomers();
      }
    })
  }
  deleteCust(id:number)
  {
    this.api.deleteRecord(id)
    .subscribe({
      next:(res)=>{
        alert("Customer record deleted successfully");
        this.getAllCustomers();
      },
      error:()=>{
        alert("Error while deleting the record");
      }
    })
  }
 /*  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }*/
}
