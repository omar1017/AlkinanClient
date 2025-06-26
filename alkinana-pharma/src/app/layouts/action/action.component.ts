import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HideIfClaimsNotMetDirective } from '../../shared/directives/hide-if-claims-not-met.directive';
import { claimReq } from '../../shared/utils/claimReq';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,HideIfClaimsNotMetDirective],
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent {
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() active = new EventEmitter();

  @Input() isActive!:boolean;

  claimReq = claimReq;

  onUpdate() {
    this.update.emit(); 
  }

  onDelete() {
    this.delete.emit(); 
  }

  onActive(){
    this.active.emit();
  }
}
