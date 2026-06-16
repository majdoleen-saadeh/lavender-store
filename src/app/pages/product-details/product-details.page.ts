import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import { arrowBackOutline, bagAddOutline, heartOutline, shareSocialOutline, hardwareChipOutline } from 'ionicons/icons';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ProductDetailsPage implements OnInit {

  product: any = null;

  // المنتجات الافتراضية للبحث بداخلهما إذا كان المنتج أساسياً
  defaultProducts = [
    { id: '1', name: 'Lavender Watch v2', description: 'Dynamic contextual health metrics tracking nodes.', price: 120, icon: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', stock: 15 },
    { id: '2', name: 'Smart Glasses Alpha', description: 'Augmented reality overlay ambient lens display.', price: 250, icon: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', stock: 3 },
    { id: '3', name: 'IoT Lavender Hub', description: 'Central hardware automated gateway appliance routing.', price: 99, icon: 'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?w=500', stock: 20 }
  ];

  constructor(private route: ActivatedRoute, private toastController: ToastController) {
    addIcons({ arrowBackOutline, bagAddOutline, heartOutline, shareSocialOutline, hardwareChipOutline });
  }

  ngOnInit() {
    // 1. التقاط الـ ID الديناميكي من الرابط
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId) {
      // 2. تجميع كافة المنتجات (الأساسية + منتجات البائعين) للبحث فيها
      let allProducts = [...this.defaultProducts];
      const vendorSaved = localStorage.getItem('lavender_vendor_products');
      if (vendorSaved) {
        allProducts = [...allProducts, ...JSON.parse(vendorSaved)];
      }

      // 3. مطابقة المنتج المستهدف
      this.product = allProducts.find(p => p.id === productId);
    }
  }

  // دالة الشراء من داخل صفحة التفاصيل
  addToCart() {
    if (!this.product) return;
    let currentCart = JSON.parse(localStorage.getItem('lavender_cart') || '[]');
    const existingItem = currentCart.find((item: any) => item.id === this.product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...this.product, quantity: 1 });
    }

    localStorage.setItem('lavender_cart', JSON.stringify(currentCart));
    this.presentToast(`${this.product.name} added to cart!`);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: 'secondary'
    });
    await toast.present();
  }
}