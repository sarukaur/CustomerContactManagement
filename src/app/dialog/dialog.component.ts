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
  CustomerForm !: FormGroup;
  actionBtn:string="Save";
  constructor(private formBuilder: FormBuilder, 
    private api: ApiService, 
    @Inject(MAT_DIALOG_DATA) public modifyData :any,
    private ref:MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.CustomerForm=this.formBuilder.group({
      firstName:['',[Validators.required,Validators.maxLength(50)]],
      lastName:['',[Validators.required,Validators.maxLength(50)]],
      Email:['',[Validators.required,Validators.maxLength(100)]],
      Phone:['',[Validators.required,Validators.minLength(10),Validators.maxLength(12),Validators.pattern('[0-9]*')]]
    })
    if(this.modifyData)
    {
      this.actionBtn="Update";
      this.CustomerForm.controls["firstName"].setValue(this.modifyData.firstName);
      this.CustomerForm.controls["lastName"].setValue(this.modifyData.lastName);
      this.CustomerForm.controls["Email"].setValue(this.modifyData.Email);
      this.CustomerForm.controls["Phone"].setValue(this.modifyData.Phone);
    }
  }
  addCustomer()
  {
    if(!this.modifyData)
    {
      if(this.CustomerForm.valid)
      {
        this.api.postCustomer(this.CustomerForm.value)
        .subscribe({
          next:(res)=>{
            alert("Record added successfully");
            this.CustomerForm.reset();
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
      this.updateCust();
    }
  }
  updateCust()
  {
    if(this.CustomerForm.valid)
    {
      this.api.putRecord(this.CustomerForm.value,this.modifyData.id)
      .subscribe({
        next:(res)=>{
          alert("Customer Details updated successfully");
          this.CustomerForm.reset();
          this.ref.close('update');
        },
        error:()=>{
          alert("Error while updating the record");
        }
      })
    }
  }
}
