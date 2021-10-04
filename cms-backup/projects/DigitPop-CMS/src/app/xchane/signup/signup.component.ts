import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { XchaneAuthenticationService } from '../../shared/services/xchane-auth-service.service';
import { AuthenticationService } from '../../shared/services/auth-service.service';
import { ConfirmedValidator } from '../../shared/helpers/confirmed.validator';
import { XchaneUser } from '../../shared/models/xchane.user';
import { User} from '../../shared/models/user';
import { Role } from '../../shared/models/role';


@Component({
  selector: 'DigitPop-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  submitted = false;
  isCheckedConsumer :boolean;
  isCheckedBusiness :boolean;
  validRole:any;
  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private authService: XchaneAuthenticationService,
    private authService:AuthenticationService,
  ) {
    this.signUpForm = fb.group(
      {
        email: ['', Validators.required],
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirm_password'),
      }
    );
  }
  onChange($event:any) {
    if($event.source.value=="1"){
      this.signUpForm.controls['email'].enable();
      this.signUpForm.controls['password'].enable();
      this.signUpForm.controls['confirm_password'].enable();
      this.validRole=Role.Consumer;
    }
    if($event.source.value=="2"){
      this.validRole=Role.Business;
      this.signUpForm.controls['email'].disable();
      this.signUpForm.controls['password'].disable();
      this.signUpForm.controls['confirm_password'].disable();
    }
    console.log(this.validRole);
 } 
//   OnChangec($event: any){
//     this.isCheckedConsumer= false;
//     this.isCheckedBusiness =false;
//     this.isCheckedConsumer =$event.source.checked;
//      console.log(this.isCheckedConsumer,this.isCheckedBusiness); 
//      if(this.isCheckedConsumer=true){
//        this.validRole=Role.Consumer;
//      }
//     // MatCheckboxChange {checked,MatCheckbox}
//   }
//   OnChangeb($eventa: any){
//     this.isCheckedConsumer= false;
//     this.isCheckedBusiness =false;
//     this.isCheckedBusiness =$eventa.source.checked;
//     if(this.isCheckedBusiness=true){
//       this.validRole=Role.Business;
//     }
//     console.log(this.isCheckedBusiness,this.isCheckedConsumer); 
//    // MatCheckboxChange {checked,MatCheckbox}
//  }
  ngOnInit(): void {}

  get f() {
    return this.signUpForm.controls;
  }
  
  submit() {
    var user = new User();
    user.email = this.signUpForm.controls['email'].value;
    user.password = this.signUpForm.controls['password'].value;
    user.role=this.validRole;
    // console.log(this.signUpForm.controls['roleSelection'].value);
    
    // stop here if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    this.authService.createUser(user).subscribe(
      (res) => {
        this.dialogRef.close();
        
        // console.log(res);
        // this.router.navigate(['/xchane/dashboard']);
        this.router.navigate(['/']);
      },
      (err) => {
        console.log('Update error : ' + err.toString());
      }
    );
  }
}
