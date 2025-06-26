import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IProduct, ProductService } from '../../shared/services/product.service';
import { FileService } from '../../shared/services/file.service';
import { fromInteropObservable } from 'rxjs/internal/observable/innerFrom';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { publishFacade } from '@angular/compiler';

@Component({
  selector: 'app-product',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
    @Output() productSaved = new EventEmitter<any>(); 
    productForm: FormGroup;
    isEdit: boolean = false;
    productData: any;
    selectedImage: string | null = null;
    selectedFile: File | null = null;

    selectedImag: string | null = null;
    selectedFil: File | null = null;
  
    constructor(
      public bsModalRef: BsModalRef,
      private fb: FormBuilder,
      private productService: ProductService,
      private fileService:FileService,
      private toastr:ToastrService
    ) {
      this.productForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        sName: ['',Validators.required],
        image: [null],
        imageUrl: ['' ],
        imageId: ['' ],
        imgUrl: [''],
        imgId: [''],
        companyName: ['', Validators.required],
        description: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(1)]],
        supplier: ['', Validators.required],
        notes: [''],
        message: [''],
        isActive: [booleanAttribute],
        publicPrice:['', Validators.required],
        quantity: ['', Validators.required]
      });
    }
  
    ngOnInit() {
      if (this.isEdit && this.productData) {
        this.productForm.patchValue({
          id: this.productData.id,
          name: this.productData.name,
          sName:this.productData.sName,
          imageUrl:this.productData.imageUrl,
          imageId:this.productData.imageId,
          imgUrl: this.productData.imgUrl,
          imgId: this.productData.imgId,
          companyName: this.productData.companyName,
          description: this.productData.description,
          price: this.productData.price,
          supplier: this.productData.supplier,
          notes: this.productData.notes,
          message: this.productData.message,
          isActive: this.productData.isActive,
          publicPrice : this.productData.publicPrice,
          quantity: this.productData.quantity
        });
        this.selectedImage = this.productData.imageUrl;
        this.selectedImag = this.productData.imgUrl;
      }
    }
  
    onFileSelectedProduct(event: Event) {
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

    onFileSelectedWarning(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.selectedFil = input.files[0];
        
        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImag = e.target?.result as string;
        };
        reader.readAsDataURL(this.selectedFil);
        
        // Update form control
        this.productForm.patchValue({
          imag: this.selectedFil
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

  if(this.selectedFil && formValues.imagId){
    const imageName = this.getImageNameFromUrl(formValues.imagUrl)

    this.fileService.deleteProductImage({id: formValues.imagId, url: formValues.imagUrl}, imageName ).subscribe();
  }

  // إذا كانت الصورة مختارة، انتظر رفعها أولاً
  if (this.selectedFil) {
    const ImageForm = new FormData();
    ImageForm.append('file', this.selectedFil, this.selectedFil.name);

    try {
      const res: any = await lastValueFrom(this.fileService.uploadImage(ImageForm));
      formValues.imgId = res.id;
      formValues.imgUrl = res.url;
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
      this.toastr.success('Product Was Update Successfuly', 'Modification Successful')
    } else {       
      const res = await lastValueFrom(this.productService.addProduct(formData));
      formValues.id = res.id.value;
      this.toastr.success('Product Was Added Successfuly', 'Addtion Successful')
    }
    this.productSaved.emit(formValues);
    this.bsModalRef.hide();
  } catch (error) {
    console.error('Error saving product:', error);
    this.toastr.error('failed Add or Edit', 'Error Operation')
  }
}

}
