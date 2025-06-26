import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { LoadProductService } from '../../shared/services/load-product.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  searchText: string = '';
  @Input() options! : string[];
  
  @Output() filter = new EventEmitter<any>();
  selectedOption!: string ;
  

  constructor(private loadProductsService: LoadProductService){}

  applyFilter() {
    this.filter.emit({ text: this.searchText, option: this.selectedOption });
  }
}