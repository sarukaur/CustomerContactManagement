import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import{MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { subscribeOn } from 'rxjs';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  EmployeeForm !: FormGroup;
  actionBtn:string="Save";
  constructor(private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public modifyData :any,
    private ref:MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.EmployeeForm=this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      Email:['',Validators.required],
      Phone:['',Validators.required]
    })
    if(this.modifyData)
    {
      this.actionBtn="Update";
      this.EmployeeForm.controls["firstName"].setValue(this.modifyData.firstName);
      this.EmployeeForm.controls["lastName"].setValue(this.modifyData.lastName);
      this.EmployeeForm.controls["Email"].setValue(this.modifyData.Email);
      this.EmployeeForm.controls["Phone"].setValue(this.modifyData.Phone);
    }
  }
  addEmployee()
  {
    if(!this.modifyData)
    {
      if(this.EmployeeForm.valid)
    {
      this.api.postEmployee(this.EmployeeForm.value)
      .subscribe({
        next:(res)=>{
          alert("Record added successfully");
          this.EmployeeForm.reset();
          this.ref.close('save');
        },
        error:()=>
        {
          alert("error while adding the product")
        }
        
      })
    }
    }
    else
    {
      this.updateEmp();
    }
  }
updateEmp()
{
  this.api.putRecord(this.EmployeeForm.value,this.modifyData.id)
  .subscribe({
    next:(res)=>{
      alert("Employee Details updated successfully");
      this.EmployeeForm.reset();
      this.ref.close('update');
    },
    error:()=>{
      alert("Error while updating the record");
    }

  })
}
}
