import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  form!:FormGroup;
  loginRequest!:any;
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  
    if (this.service.isLoggedIn()){
      const role = this.service.getUserRole();
      this.routeUser(role);
    }
      
  }
  isSubmitted: boolean = false;

 
  hasDisplayableError(controlName: string): Boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
           (this.isSubmitted || 
           Boolean(control?.touched) || 
           Boolean(control?.dirty))
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
        this.service.signin(this.form.value).subscribe({
            next: (res: any) => {
                // 1. تخزين جميع التوكنات
                this.service.storeTokens({
                    token: res.token,
                    refreshToken: res.refreshToken
                });

                // 2. توجيه المستخدم حسب الدور
                const role = this.service.getUserRole();
                this.routeUser(role);

                // 3. (اختياري) إظهار رسالة نجاح
                this.toastr.success('تم تسجيل الدخول بنجاح');
            },
            error: err => {
                // 4. معالجة الأخطاء بشكل مفصل
                if (err.status === 400) {
                    this.toastr.error('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'فشل تسجيل الدخول');
                } else if (err.status === 403) {
                    this.toastr.error('الحساب غير مفعل', 'يرجى التحقق من بريدك الإلكتروني');
                } else {
                    console.error('حدث خطأ غير متوقع:', err);
                    this.toastr.error('حدث خطأ غير متوقع', 'فشل تسجيل الدخول');
                }
            }
        });
    }
}

  private routeUser(role:any) : void{
    if (role === 'Administrator') {
      this.router.navigateByUrl('/admin-only');
    } else if (role === 'CustomerAccount') {
      this.router.navigateByUrl('/repo');
    } 
  }

}