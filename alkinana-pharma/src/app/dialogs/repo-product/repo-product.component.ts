import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductService } from '../../shared/services/product.service';
import { FileService } from '../../shared/services/file.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repo-product',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './repo-product.component.html',
  styleUrl: './repo-product.component.css'
})
export class RepoProductComponent {
  @Output() productSaved = new EventEmitter<any>(); 
      productForm: FormGroup;
      isEdit: boolean = false;
      productData: any;
      selectedImage: string | null = null;
      selectedFile: File | null = null;
    
      constructor(
        public bsModalRef: BsModalRef,
        private fb: FormBuilder,
        private productService: ProductService,
        private fileService:FileService
      ) {
        this.productForm = this.fb.group({
          id: [''],
          name: ['', Validators.required],
          sName: ['', Validators.required],
          image: [null],
          imageUrl: ['' ],
          imageId: ['' ],
          companyName: ['', Validators.required],
          description: ['', Validators.required],
          price: [0, [Validators.required, Validators.min(1)]],
          notes: ['']
        });
      }
    
      ngOnInit() {
        if (this.isEdit && this.productData) {
          this.productForm.patchValue({
            id: this.productData.id,
            name: this.productData.name,
            sName: this.productData.sName,
            imageUrl:this.productData.imageUrl,
            imageId:this.productData.imageId,
            companyName: this.productData.companyName,
            description: this.productData.description,
            price: this.productData.price,
            notes: this.productData.notes
          });
          this.selectedImage = this.productData.imageUrl;
        }
      }
    
      onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
          this.selectedFile = input.files[0];
          
          // Preview image
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImage = e.target?.result as string;
          };
          reader.readAsDataURL(this.selectedFile);
          
          // Update form control
          this.productForm.patchValue({
            image: this.selectedFile
          });
        }
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
    
      
  async saveProduct(): Promise<void> {
  
  
    if (this.productForm.invalid) return;
  
    const formData = new FormData();
    const formValues = this.productForm.value;
  
    if(this.selectedFile && formValues.imageId){
      const imageName = this.getImageNameFromUrl(formValues.imageUrl)
  
      this.fileService.deleteProductImage({id: formValues.imageId, url: formValues.imageUrl}, imageName ).subscribe();
    }
  
    // إذا كانت الصورة مختارة، انتظر رفعها أولاً
    if (this.selectedFile) {
      const ImageForm = new FormData();
      ImageForm.append('file', this.selectedFile, this.selectedFile.name);
  
      try {
        const res: any = await lastValueFrom(this.fileService.uploadImage(ImageForm));
        formValues.imageId = res.id;
        formValues.imageUrl = res.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }
  
    Object.keys(formValues).forEach(key => {
      if (key !== 'image' ) {
        formData.append(key, formValues[key]);
      }
    });
    
    try {
      if (this.isEdit && formValues?.id) {
        await lastValueFrom(this.productService.updateProduct(formValues.id, formData));
      } else {
  
         
        const res = await lastValueFrom(this.productService.addProduct(formData));
        formValues.id = res.id.value;
      }
      this.productSaved.emit(formValues);
      this.bsModalRef.hide();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }
  
}
