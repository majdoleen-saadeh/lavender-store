import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';

// استيراد الأيقونات الخاصة بالسلة
import { addIcons } from 'ionicons';
import {
  trashOutline,
  addOutline,
  removeOutline,
  arrowBackOutline,
  cardOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class CartPage implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private toastController: ToastController) {
    // تسجيل الأيقونات
    addIcons({
      trashOutline,
      addOutline,
      removeOutline,
      arrowBackOutline,
      cardOutline,
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  // تحميل عناصر السلة وحساب المجموع كلياً
  loadCart() {
    const savedCart = localStorage.getItem('lavender_cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    } else {
      this.cartItems = [];
    }
    this.calculateTotal();
  }

  // حساب المجموع الإجمالي للفاتورة
  calculateTotal() {
    this.totalPrice = this.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
  }

  // زيادة كمية المنتج الحالي
  updateQuantity(item: any, change: number) {
    item.quantity += change;

    // إذا قلّت الكمية عن 1، نقوم بحذف المنتج تلقائياً
    if (item.quantity < 1) {
      this.removeItem(item.id);
      return;
    }

    this.saveCartState();
  }

  // حذف منتج بالكامل من السلة
  removeItem(id: string) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
    this.saveCartState();
    this.presentToast('Item removed from cart.');
  }

  // حفظ الحالة الحالية في الـ LocalStorage وتحديث الفاتورة
  saveCartState() {
    localStorage.setItem('lavender_cart', JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  // محاكاة عملية الدفع النهائي (Checkout)
  checkout() {
    if (this.cartItems.length === 0) return;

    this.presentToast(
      'Order Placed Successfully! Lavender Hub is processing it.',
      'success',
    );
    this.cartItems = [];
    localStorage.removeItem('lavender_cart');
    this.totalPrice = 0;
  }

  async presentToast(message: string, color: string = 'secondary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}
