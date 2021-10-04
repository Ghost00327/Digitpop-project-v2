import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmedValidator } from '../shared/helpers/confirmed.validator';
import { User } from '../shared/models/user';
import { AuthenticationService } from '../shared/services/auth-service.service';
import { BillsbyService } from '../shared/services/billsby.service';

@Component({
  selector: 'app-root',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  cid: any;
  sid: any;
  billsbyUserInfo: any;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private billsbyService: BillsbyService
  ) {
    console.log("REGISTER COMPONENT");

    this.form = fb.group(
      {
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirm_password'),
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    var user = new User();
    user.password = this.form.controls["password"].value;
    user.name = this.billsbyUserInfo.email;
    user.cid = this.cid;
    user.sid = this.sid;

    this.authService.createUser(user).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        console.log('Update error : ' + err.toString());
      }
    );

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.cid = params['cid'];
      this.sid = params['sid'];
      this.getBillsbyCustomer(this.cid);
    });
  }

  getBillsbyCustomer(id: any) {
    this.billsbyService.getCustomerDetails(id).subscribe(
      (res) => {
        this.billsbyUserInfo = res;
        console.log('Update response : ' + res.toString());
      },
      (err) => {
        console.log('Update error : ' + err.toString());
      }
    );
  }
}
