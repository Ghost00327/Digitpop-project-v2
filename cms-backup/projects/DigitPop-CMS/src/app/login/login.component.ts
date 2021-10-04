import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../shared/services/auth-service.service';
import { BillsbyService } from '../shared/services/billsby.service';

@Component({
  selector: 'DigitPop-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private billsbyService: BillsbyService
  ) {

    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //   this.dialogRef.close();
    //   this.router.navigate(['/cms/dashboard']);
    // } else {
    //   this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    
    // get return url from route parameters or default to '/'
    // if (this.authenticationService.currentUserValue) {
    //   this.returnUrl =
    //     this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    //   this.dialogRef.afterClosed().subscribe(
    //     data => this.router.navigate(['/cms/dashboard'])
    //   );
    // }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    // console.log("user:",this.f.email.value, this.f.password.value);
    this.loading = true;
    this.authenticationService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log('LOGIN RESULT : ' , this.authenticationService.currentUserValue);

          // HACK - REMOVE FOR PROD
          // if (this.f.email.value == 'jeff@jeff.com') {
          //   console.log('NAVIGATING TO DASHBOARD IN LOGIN');
          //   this.dialogRef.close();
          //   //this.router.navigate(['/cms/dashboard']);
          // }
          console.log(res.role);
          // this.billsbyService.getSubscriptionDetails().subscribe(
          //   (res: any) => {
          //     if (res.status != 'Cancelled') {
          //       this.router.navigate(['/cms/dashboard']);
          //     } else {
          //       this.authenticationService.logout();
          //     }
          //     console.log('Update response : ', res.toString());
          //   },
          //   (err: any) => {
          //     console.log('Update error : ', err.toString());
          //   }
          // );
          this.dialogRef.close();
          if(res.role=="admin"||res.role=="Business"){
            console.log(res.role);
            this.router.navigate(['/cms/dashboard']);

          };
          if(res.role=="consumer"){
            this.router.navigate(['/xchane/dashboard']);
            console.log(res.role);
          };
        
          

        },
        (error: any) => {
          this.error = error;
          this.loading = false;
        }
      );
  }
}
