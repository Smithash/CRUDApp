import {Component, ContentChild, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UsersService} from "../shared/users.service";
import {UsersModel} from "../shared/users.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';
import * as sweetalert2 from "sweetalert2";
import {HttpErrorResponse, HttpResponse, HttpStatusCode} from "@angular/common/http";

// CommonJS


declare var window: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  modalTitle: string;
  description: string;
  title: string = 'User Information';
  formIsInvalid: boolean = false;
  //formModal: any;
  user: any[] =[];
  userDetails: any;
  userList: any;
  userForm: FormGroup;
  getUserFormValue: any;

  showPassword: boolean = false;

  showHidePassword(){
    this.showPassword =!this.showPassword;
  }

  //form: FormGroup;
  //creating columns fields for the table for users page
  cols: any[] = [
    {field: 'username',header: 'Username'},
    {field: 'password', header: 'Password'},
    {field: 'firstname', header: 'Firstname'},
    {field: 'surname',header:'Surname'},
    {field:'idNumber', header:'Id Number'},
    {field:'email', header: 'Email'}];
  constructor(private usersService: UsersService, private fb: FormBuilder){
    this.formBuilder();
  }
  ngOnInit(): void {
    this.getAllUsers();

  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getAllUsers(){
    this.usersService.getUsers().subscribe((data : any) => {
    //   data.sort((a,b)=>{
    //     if(a.firstname > b.firstname){
    //       return 1;
    //     }
    //     if(a.firstname< b.firstname){
    //       return -1;
    //     }
    //     return 0;
    //   });
      data.sort((userSortParamA, userSortParamB) =>{
        return userSortParamA.username.localeCompare(userSortParamB.username);
      });
      this.userList = data;

    });
  }

  formBuilder(){
    this.userForm = this.fb.group({
      username: ['',[Validators.required]],

      password: ['',[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      firstname: ['',[Validators.required]],
      surname: ['',[Validators.required]],
      idNumber: ['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      email:['',[Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
//
    });
}

getUserFormValues(){
   this.getUserFormValue = {
    firstname: this.userForm.get('firstname').value,
    surname: this.userForm.get('surname').value,
    idNumber: this.userForm.get('idNumber').value,
    username: this.userForm.get('username').value,
    password: this.userForm.get('password').value,
    email: this.userForm.get('email').value,
  };
   this.getUserFormValue.firstname = this.capitalizeFirstLetter(this.getUserFormValue.firstname);
   this.getUserFormValue.surname = this.capitalizeFirstLetter(this.getUserFormValue.surname);
}
  checkForm(){
    if(this.userForm.invalid){
      this.userForm.controls['firstname'].markAsTouched();
      this.userForm.controls['surname'].markAsTouched();
      this.userForm.controls['username'].markAsTouched();
      this.userForm.controls['password'].markAsTouched();
      this.userForm.controls['email'].markAsTouched();
      this.userForm.controls['idNumber'].markAsTouched();
      this.formIsInvalid = true;
      return;
    }
    else{
      this.formIsInvalid = false;
    }

  }

  successAlert(process){
  Swal.fire(
    'Success',
    `User has been ${process}`,
    'success'
  ).then((isvalid)=>{
    if(isvalid){
      this.closeModal();
    }
  })
}
  errorAlert(process){
    Swal.fire(
      'Error',
      `User could not be ${process}, try again!`,
      'error');
  }

  submit(): void {

    this.checkForm();
    this.getUserFormValues();

    if (this.userDetails) {
      let updatedUser: UsersModel = {
        id: this.userDetails.id,
        firstname: this.userForm.get('firstname').value,
        surname: this.userForm.get('surname').value,
        idNumber: this.userForm.get('idNumber').value,
        username: this.userForm.get('username').value,
        password: this.userForm.get('password').value,
        email: this.userForm.get('email').value
      };

      updatedUser.firstname = this.capitalizeFirstLetter(updatedUser.firstname);
      updatedUser.surname = this.capitalizeFirstLetter(updatedUser.surname);

      this.userDetails.firstname.trim().replace(/\s{2,}/g, " ");
      this.userDetails.surname.trim().replace(/\s{2,}/g, " ");
      this.userDetails.email.trim().replace(/\s{2,}/g, " ");
      this.userDetails.idNumber.trim().replace(/\s{2,}/g, " ");
      this.userDetails.username.trim().replace(/\s{2,}/g, " ");
      this.userDetails.password.trim().replace(/\s{2,}/g, " ");


        if(this.formIsInvalid === false){
          this.usersService.updateUser(updatedUser).subscribe(() => {
          });
          if (HttpStatusCode.Ok) {
            this.successAlert('edited');
          } else {
            this.errorAlert('edited');
          }
        }

    } else {

      if(this.formIsInvalid === false){
        console.log(this.formIsInvalid);
        this.usersService.createUser(this.getUserFormValue).subscribe(() => {
        });
        if (HttpStatusCode.Ok) {
          this.successAlert('added');
        } else {
          this.errorAlert('added');
        }
      }
      }
    }

  openModal(item)
{

  document.getElementById("id01").style.display = "block";

  if (item.id) {
    this.modalTitle = 'Edit User';
    this.description = 'edit user.';

    this.userDetails = item;
    this.userForm.controls['firstname'].patchValue(item.firstname);
    this.userForm.controls['surname'].patchValue(item.surname);
    this.userForm.controls['username'].patchValue(item.username);
    this.userForm.controls['password'].patchValue(item.password);
    this.userForm.controls['email'].patchValue(item.email);
    this.userForm.controls['idNumber'].patchValue(item.idNumber);
  } else {

    this.modalTitle = 'Add New User';
    this.description = ' create a new user.';
  }
}

  closeModal(){

      document.getElementById('id01').style.display='none';
      window.location.reload();
  }

  autoGenerateUsername() { //doesnt work

    /*let firstname = this.getUserFormValue.firstname;
    let surname = this.getUserFormValue.surname;
    let id = this.getUserFormValue.idNumber;

    let username = firstname.substr(0,2)+surname.substr(0,2)+id.substr(0,1);
    console.log('Username:',username);
    return username;*/
  }


}
