import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet,RouterModule],
  templateUrl: './user.component.html',
    styles: ``,
    animations: [
        trigger('routerFadeIn', [
            transition('* <=> *', [
                query(':enter', [
                    style({ opacity: 0 }),
                    animate('1s ease-in-out', style({ opacity: 1 }))
                ], { optional: true }),
            ])
        ])
    ]
})
export class UserComponent {

  constructor(private context: ChildrenOutletContexts) { }

  getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }

}
