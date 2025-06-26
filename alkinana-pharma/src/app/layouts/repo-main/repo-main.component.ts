import { Component, inject, OnInit } from '@angular/core';
import { RepoProductComponent } from '../../dialogs/repo-product/repo-product.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { ProductService } from '../../shared/services/product.service';
import { LoadProductService } from '../../shared/services/load-product.service';
import { RepoTableComponent } from "../repo-table/repo-table.component";
import { LoadingComponent } from "../loading/loading.component";
import { PagenationComponent } from "../pagenation/pagenation.component";
import { FilterComponent } from "../filter/filter.component";
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-repo-main',
  imports: [RepoTableComponent, LoadingComponent, PagenationComponent, FilterComponent],
  templateUrl: './repo-main.component.html',
  styleUrl: './repo-main.component.css'
})
export class RepoMainComponent implements OnInit {
 productForm: FormGroup;
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

  options = ['Name', 'Supplier']

  selectProduct:any;

  isEdit = false;

  receivedData : any;
  private subscirption! : Subscription;

  constructor(private fb: FormBuilder, private productService:ProductService, private loadProductsService:LoadProductService,private authService:AuthService) {
    this.productForm = this.fb.group({
      products: this.fb.array([])
    });
    
    }

    onLogout(){
      this.authService.deleteToken();
      this.router.navigateByUrl('/signin');
    }

    ngOnInit(): void {
      this.loadProducts(this.pageNumber,this.pageSize)
      this.route.queryParams.subscribe(params => {
        if (params['openDialog'] === 'true' && !this.isDialogOpened) {
          this.isDialogOpened = true; 
          
          // if (params['productId']) {
          //   this.dialogService.openEditPatientDialog({ id: params['productId'] });
          // } else {
          //     this.dialogService.openAddPatientDialog();
          // }
  
          this.router.navigate([], {
            queryParams: { openDialog: null, productId: null },
            queryParamsHandling: 'merge'
          });
        }
      });

      this.subscirption = this.loadProductsService.buttonClicked.subscribe(data =>{
        this.receivedData = data;
        this.loadProducts(this.receivedData.pn, this.receivedData.pz, this.receivedData.option,this.receivedData.text);
      })
    }

  ngOnDestroy(): void {
    this.subscirption.unsubscribe();
  }
    openAddPatientDialog(): void {
      this.router.navigate([], {
        queryParams: { openDialog: 'true' },
        queryParamsHandling: 'merge'
      });
    
      this.modalRef = this.modalService.show(RepoProductComponent);
      
      this.modalRef.content.productSaved.subscribe((product: any) => {
        this.products.push(this.createProduct(product));
        
      });
      this.modalRef.onHidden?.subscribe(() => {
        
        this.router.navigate([], {
          queryParams: { openDialog: null },
          queryParamsHandling: 'merge'
        });
      });
    }
    private isDialogOpened : boolean = true;
    
  

  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }

  createProductFormGroup(product?: any): FormGroup {
    return this.fb.group({
      id:product.productId.value,
      name:product.productName,
      sName:product.sName,
      image:product.image,
      imageUrl:product.productImage.url,
      imageId:product.productImage.id,
      description: product.description,
      companyName:product.companyName,
      price:product.price,
      notes:product.notes
    });
  }

  createProduct(product?: any): FormGroup {
    return this.fb.group({
      id:product.id,
      name:product.name,
      sName:product.sName,
      image:product.image,
      imageUrl:product.imageUrl,
      imageId:product.imageId,
      description: product.description,
      companyName:product.companyName,
      price:product.price,
      notes:product.notes
    });
  }

  

  async loadProducts(pn: number, pz: number, opt?: string, fil?: string): Promise<void> {
    try {
        this.isLoading = true;
        this.products.clear(); 
  
      const response = this.productService.getProducts(pn, pz, opt, fil);
      
      response.subscribe(res => {
        this.totalCount = res.totalCount;
        this.pageNumber = res.pageNumber;
        res.products.forEach( (p:any) => {
          this.products.push(this.createProductFormGroup(p));
        });
  
         this.isLoading = false; 
      }); 
    } catch (error) {
      this.errorMessage = 'Failed to load products';
      console.error(error);
    }
  }

  addProducts(): void {
    this.products.push(this.createProductFormGroup());
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.loadProducts(this.pageNumber - 1,this.pageSize);
    }
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.loadProducts(this.pageNumber + 1,this.pageSize);
    }
  }

  get totalPages() {
    return Math.ceil(this.totalCount / this.pageSize);
  }
}
