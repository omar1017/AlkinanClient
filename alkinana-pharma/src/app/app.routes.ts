import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { MainComponent } from './layouts/main/main.component';
import { authGuard } from './shared/auth.guard';
import { claimReq } from './shared/utils/claimReq';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AppComponent } from './app.component';
import { FirstComponent } from './first/first.component';
import { RepoMainComponent } from './layouts/repo-main/repo-main.component';
import { SupplierMainComponent } from './layouts/supplier-main/supplier-main.component';
import { ProductItemsComponent } from './product-items/product-items.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { MainCartsComponent } from './layouts/main-carts/main-carts.component';
import { WrongComponent } from './wrong/wrong.component';

export const routes: Routes = [

    {path:'', component:ProductItemsComponent},
    {path:'cart', component: CartComponent},
    {path:'checkout', component:CheckoutComponent},
    {path:'order-confirmation',component:OrderConfirmationComponent},

    {path:'',component:UserComponent,
        children:[
            {path:'signup',component:RegistrationComponent},
            {path:'signin',component:LoginComponent}
        ]
    },
    {path:'',component:FirstComponent,canActivate:[authGuard],
        canActivateChild:[authGuard],
        children:[
            {path:'admin-only',component:MainComponent,
                data: {claimReq: claimReq.adminOnly}
            },
            {path:'orders', component:MainCartsComponent,
                data: {claimReq: claimReq.adminOnly}
            },
            {
                path:'repo',component:RepoMainComponent,
                data:{claimReq: claimReq.repo}
            },
            {path:'suppliers',component:SupplierMainComponent,
                data:{claimReq: claimReq.adminOnly}
            },
            {path:'forbidden',component:ForbiddenComponent}
        ]
    }
];