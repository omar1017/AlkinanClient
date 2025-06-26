import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MainComponent } from "./layouts/main/main.component";
import { AuthService } from './shared/services/auth.service';
import { claimReq } from './shared/utils/claimReq';
import { HideIfClaimsNotMetDirective } from './shared/directives/hide-if-claims-not-met.directive';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 
  title = 'alkinana-pharma';

}
