import { Directive, ElementRef, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHideIfClaimsNotMet]',
  standalone: true
})
export class HideIfClaimsNotMetDirective {
  @Input("appHideIfClaimsNotMet") claimReq!:Function
  constructor(private authService:AuthService,
    private elementRef:ElementRef
  ) { }
  ngOnInit(): void {

    const claims = this.authService.getClaims();
    if(!this.claimReq(claims))
      this.elementRef.nativeElement.style.display = "none";

  }
}
