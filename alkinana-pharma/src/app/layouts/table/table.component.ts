import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from '../../shared/services/product.service';
import { ProductComponent } from '../../dialogs/product/product.component';
import { ActionComponent } from '../action/action.component';
import { CommonModule } from '@angular/common';
import { FileService } from '../../shared/services/file.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table',
  standalone : true,
  imports: [ActionComponent,CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() productForm! : FormGroup;
  @Input() isLoading!:boolean;
  @Input() products!:FormArray;
  @Input() errorMessage:string | null = null;

  @Output() patchActive = new EventEmitter();

  isActive:boolean = false;

  modalRef? : BsModalRef;
  private modalService = inject(BsModalService);
  private router = inject(Router);
  
  
  constructor(private productService:ProductService, private fileService:FileService, private toastr:ToastrService) { }

 
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

    this.modalRef = this.modalService.show(ProductComponent, { initialState: { isEdit: true, productData } });

    this.modalRef.content.productSaved.subscribe((product: any) => {
      this.products.at(index).patchValue({
        id: product.id,
        name:product.name || '',
        sName:product.sName,
        imageUrl:product.imageUrl || '',
        imageId:product.imageId || '',
        companyName: product.companyName || '',
        description: product.description || '',
        imgUrl:product.imgUrl,
        imgId:product.imgId,
        supplier: product.supplier || '',
        price: product.price || '',
        image: product.image || '',
        notes: product.notes || '',
        message:product.message,
        isActive: product.isActive,
        publicPrice: product.publicPrice,
        quantity: product.quantity
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

  activeProduct(index: number): void {
    const product = this.products.at(index).value;
    this.patchActive.emit({index:index, product:product})
    this.productService.activeProduct(product.id).subscribe({
      next: (res:any)=>{
        this.toastr.success('Successful');
        this.products.at(index).value.isActive = !product.isActive;
      }
    }); 
    this.isActive = true;
  }
}
