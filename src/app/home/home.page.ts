import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  cartOutline,
  statsChartOutline,
  personCircleOutline,
  shieldCheckmarkOutline,
  bagAddOutline,
  homeOutline,
  gridOutline,
  watchOutline,
  flameOutline,
  megaphoneOutline,
  arrowBackOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule],
})
export class HomePage implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  wishlistItems: any[] = [];
  cartCount: number = 0;
  salesProgress: number = 45;

  categories: string[] = ['All', 'Wearables', 'Smart Home', 'IoT Hubs'];
  selectedCategory: string = 'All';

  constructor(private toastController: ToastController) {
    addIcons({
      heart,
      heartOutline,
      cartOutline,
      statsChartOutline,
      personCircleOutline,
      shieldCheckmarkOutline,
      bagAddOutline,
      homeOutline,
      gridOutline,
      watchOutline,
      flameOutline,
      megaphoneOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {
    this.loadMarketplace();
  }

  ionViewWillEnter() {
    this.loadMarketplace();
  }

  loadMarketplace() {
    this.products = [
      {
        id: '1',
        name: 'Lavender Watch v2',
        category: 'Wearables',
        description: 'Dynamic contextual health metrics tracking nodes.',
        price: 120,
        icon: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        stock: 15,
        likes: 142,
        isLiked: false,
      },
      {
        id: '2',
        name: 'Smart Glasses Alpha',
        category: 'Wearables',
        description: 'Augmented reality overlay ambient lens display.',
        price: 250,
        icon: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        stock: 3,
        likes: 89,
        isLiked: false,
      },
      {
        id: '3',
        name: 'IoT Lavender Hub',
        category: 'Smart Home',
        description: 'Central hardware automated gateway appliance routing.',
        price: 99,
        icon: 'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?w=500',
        stock: 20,
        likes: 210,
        isLiked: false,
      },
    ];

    const vendorSaved = localStorage.getItem('lavender_vendor_products');
    if (vendorSaved) {
      const vendorProducts = JSON.parse(vendorSaved);
      const approvedNodes = vendorProducts.filter(
        (p: any) => p.status === 'approved',
      );
      approvedNodes.forEach((vp: any) => {
        if (!this.products.some((p) => p.id === vp.id)) {
          this.products.push({
            ...vp,
            category: vp.category || 'IoT Hubs',
            likes: 0,
            isLiked: false,
          });
        }
      });
    }

    const savedWish = JSON.parse(
      localStorage.getItem('lavender_wishlist') || '[]',
    );
    this.products.forEach((p) => {
      if (savedWish.some((w: any) => w.id === p.id)) {
        p.isLiked = true;
      }
    });

    this.updateWishlistList();

    const savedCart = localStorage.getItem('lavender_cart');
    this.cartCount = savedCart ? JSON.parse(savedCart).length : 0;

    this.filterProducts(this.selectedCategory);
  }

  filterProducts(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(
        (p) => p.category === category,
      );
    }
  }

  addToCart(product: any) {
    if (product.stock <= 0) {
      this.presentToast('Ecosystem error: Asset depleted!');
      return;
    }

    product.stock -= 1;

    const vendorSaved = localStorage.getItem('lavender_vendor_products');
    if (vendorSaved) {
      let vendorProducts = JSON.parse(vendorSaved);
      let vp = vendorProducts.find((p: any) => p.id === product.id);
      if (vp) {
        vp.stock = product.stock;
        localStorage.setItem(
          'lavender_vendor_products',
          JSON.stringify(vendorProducts),
        );
      }
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
    this.cartCount = currentCart.length;
    this.salesProgress = Math.min(this.salesProgress + 4, 100);
    this.filterProducts(this.selectedCategory);
    this.presentToast(`${product.name} synchronized to cart.`);
  }

  toggleLike(product: any) {
    product.isLiked = !product.isLiked;
    product.likes += product.isLiked ? 1 : -1;

    let savedWish = JSON.parse(
      localStorage.getItem('lavender_wishlist') || '[]',
    );
    if (product.isLiked) {
      if (!savedWish.some((w: any) => w.id === product.id)) {
        savedWish.push(product);
      }
    } else {
      savedWish = savedWish.filter((w: any) => w.id !== product.id);
    }
    localStorage.setItem('lavender_wishlist', JSON.stringify(savedWish));
    this.updateWishlistList();
  }

  updateWishlistList() {
    this.wishlistItems = JSON.parse(
      localStorage.getItem('lavender_wishlist') || '[]',
    );
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: 'secondary',
    });
    await toast.present();
  }
}
