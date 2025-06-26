import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { claimReq } from '../shared/utils/claimReq';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HideIfClaimsNotMetDirective } from '../shared/directives/hide-if-claims-not-met.directive';
import { FilterComponent } from "../layouts/filter/filter.component";

@Component({
  selector: 'app-first',
  imports: [ReactiveFormsModule, CommonModule, HideIfClaimsNotMetDirective, RouterOutlet, RouterModule],
  templateUrl: './first.component.html',
  styleUrl: './first.component.css'
})
export class FirstComponent {

  @Output() search = new EventEmitter()

  applyFilter(text:string,option:string) {
    this.search.emit({ text: text, option: option });
  }

  constructor(private router: Router,
    private authService:AuthService,
  ){}
  claimReq = claimReq;

  onLogout(){
    this.authService.deleteToken();
    this.router.navigateByUrl('/signin');
  }


}
