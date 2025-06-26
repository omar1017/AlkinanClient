import { Component, inject, Input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from '../../shared/services/product.service';
import { FileService } from '../../shared/services/file.service';
import { RepoProductComponent } from '../../dialogs/repo-product/repo-product.component';
import { ActionComponent } from '../action/action.component';
import { CommonModule } from '@angular/common';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-repo-table',
  standalone: true,
  imports: [ActionComponent,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './repo-table.component.html',
  styleUrl: './repo-table.component.css'
})
export class RepoTableComponent {
   @Input() productForm! : FormGroup;
    @Input() isLoading!:boolean;
    @Input() products!:FormArray;
    @Input() errorMessage:string | null = null;
  
    
  
    modalRef? : BsModalRef;
    private modalService = inject(BsModalService);
    private router = inject(Router);
    
    
    constructor(private productService:ProductService, private fileService:FileService) { }
  
   
     async deleteProduct(index: number): Promise<void> {
       const product = this.products.at(index).value;
       const imageName = this.getImageNameFromUrl(product.imageUrl);
       try {
          if (product.id) await this.productService.deleteProduct(product.id).subscribe(
           
            res=>{
              console.log(res);
               this.fileService.deleteProductImage({id:product.imageId,url:product.imageUrl},imageName).subscribe(
            
            )
            }
          );
         this.products.removeAt(index);
       } catch (error) {
         this.errorMessage = 'Failed to delete product';
       }
     }
  
     openEditPatientDialog(index: number,productData: any): void {
      this.router.navigate([], {
        queryParams: { openDialog: 'true', productId: productData.id },
        queryParamsHandling: 'merge'
      });
  
      this.modalRef = this.modalService.show(RepoProductComponent, { initialState: { isEdit: true, productData } });
  
      this.modalRef.content.productSaved.subscribe((product: any) => {
        this.products.at(index).patchValue({
          id: product.id,
          name:product.name || '',
          sName:product.sName || '',
          imageUrl:product.imageUrl || '',
          imageId:product.imageId || '',
          companyName: product.companyName || '',
          description: product.description || '',
          price: product.price || '',
          image: product.image || '',
        });
       
      });
  
      this.modalRef.onHidden?.subscribe(() => {
        this.router.navigate([], {
          queryParams: { openDialog: null, patientId: null },
          queryParamsHandling: 'merge'
        });
      });
    }
  
    getImageNameFromUrl(url: string): string {
      // إنشاء كائن URL من الرابط
      const urlObj = new URL(url);
      // استخراج مسار الملف (مثلاً: "/uploads/myImage.jpg")
      const pathname = urlObj.pathname;
      // تقسيم المسار باستخدام "/" وأخذ آخر جزء وهو اسم الصورة
      const parts = pathname.split('/');
      return parts[parts.length - 1];
    }
}
