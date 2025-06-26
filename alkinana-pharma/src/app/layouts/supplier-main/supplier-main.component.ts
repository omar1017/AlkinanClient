import { Component, inject, OnInit } from '@angular/core';
import { PagenationComponent } from "../pagenation/pagenation.component";
import { LoadingComponent } from "../loading/loading.component";
import { TableSupplierComponent } from "../table-supplier/table-supplier.component";
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../shared/services/supplier.service';
import { FilterComponent } from "../filter/filter.component";
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-supplier-main',
  imports: [PagenationComponent, LoadingComponent, TableSupplierComponent, FilterComponent],
  templateUrl: './supplier-main.component.html',
  styleUrl: './supplier-main.component.css'
})
export class SupplierMainComponent  implements OnInit{
supplierForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  pageNumber: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  searchText: string = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(BsModalService);
  modalRef?: BsModalRef;


  selectSupplier:any;

  isEdit = false;

  receivedData : any;
  private subscirption! : Subscription;

  options = ['Name','Address'];

  constructor(private fb: FormBuilder, private supplierService:SupplierService, private authService:AuthService) {
    this.supplierForm = this.fb.group({
      suppliers: this.fb.array([])
    });
    
    }

    ngOnInit(): void {
      this.loadSuppliers(this.pageNumber,this.pageSize)
    }

    onLogout(){
      this.authService.deleteToken();
      this.router.navigateByUrl('/signin');
    }
   
    private isDialogOpened : boolean = true;
    
  

  get suppliers(): FormArray {
    return this.supplierForm.get('suppliers') as FormArray;
  }

  createSupplierFormGroup(supplier?: any): FormGroup {
    return this.fb.group({
      id:supplier.id,
      name:supplier.name,
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      email : supplier.email,
      address: supplier.address,
      isActive:supplier.isActive
    });
  }

  createSupplier(supplier?: any): FormGroup {
    return this.fb.group({
      id: supplier.id,
      name: supplier.name,
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      email : supplier.email,
      address: supplier.address,
      isActive:supplier.isActive
    });
  }

  patchActive(index:number,supplier:any){
    this.suppliers.at(index).patchValue({
      id: supplier.id,
      name:supplier.name || '',
      firstName: supplier.firstName || '',
      lastName: supplier.lastName || '',
      email: supplier.email || '',
      address: supplier.address || '',
      isActive: true || '',
    });
  }

  

  async loadSuppliers(pn: number, pz: number, fil?: string, opt?: string): Promise<void> {
    try {
        this.isLoading = true;
        this.suppliers.clear(); 
  
      const response = this.supplierService.getSuppliers(pn, pz, fil, opt);
      
      response.subscribe(res => {
        this.totalCount = res.totalCount;
        this.pageNumber = res.pageNumber;
        res.suppliers.forEach( (p:any) => {
          this.suppliers.push(this.createSupplierFormGroup(p));
        });
  
         this.isLoading = false; 
      }); 
    } catch (error) {
      this.errorMessage = 'Failed to load suppliers';
      console.error(error);
    }
  }

  addSuppliers(): void {
    this.suppliers.push(this.createSupplierFormGroup());
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.loadSuppliers(this.pageNumber - 1,this.pageSize);
    }
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.loadSuppliers(this.pageNumber + 1,this.pageSize);
    }
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
