import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-dashboard.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {

  formValue!:FormGroup;
  employeeData!:any;
  employeeModelObj:EmployeeModel = new EmployeeModel();

  constructor(private formBuilder:FormBuilder,private api:ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',Validators.required],
      mobile:['',Validators.required],
      salary:['',Validators.required]
    })

    this.getAllEmployees();
  }

  postEmployeeDetails(){
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;

    this.api.postEmployee(this.employeeModelObj).subscribe((res:any)=>{
      console.log(res);
      alert('Employee added successfully');
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployees();
    },
    err=>{
     alert('Something went wrong');
    })
  }

  getAllEmployees(){
    this.api.getEmployee().subscribe(res=>{
      this.employeeData = res;
    })
  }

  deleteEmployee(){
    this.employeeModelObj.id = this.employeeData.id;
    this.api.deleteEmployee(this.employeeModelObj.id).subscribe(res=>{
      alert("Employee deleted");
      this.getAllEmployees();
    })
    let ref = document.getElementById('close');
      ref?.click();
  }

  onDelete(row:any){
    this.employeeData.id = row.id;
  }

  onEdit(row:any){
    this.employeeData.id = row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['salary'].setValue(row.salary);
    this.formValue.controls['mobile'].setValue(row.mobile);
    this.formValue.controls['email'].setValue(row.email);
  }

  updateEmployeeDetails(){
    this.employeeModelObj.id = this.employeeData.id;
    this.employeeModelObj.firstName = this.formValue.value.firstName;
    this.employeeModelObj.lastName = this.formValue.value.lastName;
    this.employeeModelObj.email = this.formValue.value.email;
    this.employeeModelObj.mobile = this.formValue.value.mobile;
    this.employeeModelObj.salary = this.formValue.value.salary;
    
    this.api.updateEmployee(this.employeeModelObj,this.employeeModelObj.id).subscribe(res=>{
      alert("Updated Successfully")
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployees();
    })
  }

}
