import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent  implements OnInit {
  form!: FormGroup;
  isSubmitted : boolean = false;
  constructor(public formBuilder: FormBuilder, private service:AuthService, private router:Router ,
    private toastr:ToastrService
  ){
    this.form = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      email : ['',[Validators.required, Validators.email]],
      pharmaName: ['',Validators.required],
      address: ['',Validators.required],
      password: ['',[ Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$')]],
      confirmPassword :['', Validators.required]
    }, {validators:this.passwordMatchValidator});
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl) : null =>{

    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if(password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({passwordMismatch:true});
    else
      confirmPassword?.setErrors(null)

    return null;
  }
  ngOnInit(): void {
    if(this.service.isLoggedIn())
      this.router.navigateByUrl('/admin-only');
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.service.createUser(this.form.value)
        .subscribe({
          next: (res: any) => {
            if (res != null) {
              this.form.reset();
              this.isSubmitted = false;
              this.toastr.success('Wate To Active This Account By Admin!', 'Registration Successful')
            }
          },
          error: err=> {
            this.toastr.error('error');
          }
           

        });
    }
  }

  hasDisplayableError(controlName: string): Boolean{
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched)|| Boolean(control?.dirty))
  }
 
}
