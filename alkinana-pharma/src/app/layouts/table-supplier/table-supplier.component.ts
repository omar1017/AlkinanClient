import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../shared/services/supplier.service';
import { CommonModule } from '@angular/common';
import { ActionComponent } from "../action/action.component";
import { first } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-supplier',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-supplier.component.html',
  styleUrl: './table-supplier.component.css'
})
export class TableSupplierComponent {
  @Input() supplierForm! : FormGroup;
  @Input() isLoading!:boolean;
  @Input() suppliers!:FormArray;
  @Input() errorMessage:string | null = null;

  @Output() patchActive = new EventEmitter();

      isActive : boolean = false;
      
      constructor(private supplierService:SupplierService, private toastr:ToastrService) { }
    
     
  async deleteSupplier(index: number): Promise<void> {
          const supplier = this.suppliers.at(index).value;
         try {
            if (supplier.id) await this.supplierService.deleteSupplier(supplier.id).subscribe();
           this.suppliers.removeAt(index);
         } catch (error) {
           this.errorMessage = 'Failed to delete supplier';
         }
        }
    
  activeSupplier(index: number): void {
        const supplier = this.suppliers.at(index).value;
        this.patchActive.emit({index:index, supplier:supplier})
        this.supplierService.activeSupplier(supplier.id).subscribe({
          next: (res:any)=>{
            this.toastr.success('Successful');
            this.suppliers.at(index).value.isActive = !supplier.isActive;
          }
        }); 
  }
}
