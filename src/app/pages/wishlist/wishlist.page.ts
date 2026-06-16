import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  heart,
  trashOutline,
  bagAddOutline,
  heartDislikeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class WishlistPage implements OnInit {
  wishlistItems: any[] = [];

  constructor(private toastController: ToastController) {
    addIcons({
      arrowBackOutline,
      heart,
      trashOutline,
      bagAddOutline,
      heartDislikeOutline,
    });
  }

  ngOnInit() {
    this.loadWishlist();
  }

  ionViewWillEnter() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistItems = JSON.parse(
      localStorage.getItem('lavender_wishlist') || '[]',
    );
  }

  // حذف منتج من المفضلة
  removeFromWishlist(id: string) {
    this.wishlistItems = this.wishlistItems.filter((item) => item.id !== id);
    localStorage.setItem(
      'lavender_wishlist',
      JSON.stringify(this.wishlistItems),
    );
    this.presentToast('Asset removed from your updates queue.');
  }

  // نقل المنتج مباشرة من المفضلة إلى سلة المشتريات
  moveToCart(product: any) {
    if (product.stock <= 0) {
      this.presentToast('This node is depleted! Cannot transfer.');
      return;
    }

    let currentCart = JSON.parse(localStorage.getItem('lavender_cart') || '[]');
    const existingItem = currentCart.find(
      (item: any) => item.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('lavender_cart', JSON.stringify(currentCart));

    // خيار تفضيلي: سحبه من المفضلة بعد نقله للسلة
    this.removeFromWishlist(product.id);
    this.presentToast('Transferred seamlessly to active cart channel!');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: 'purple',
    });
    await toast.present();
  }
}
