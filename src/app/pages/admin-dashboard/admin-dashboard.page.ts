import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  shieldCheckmarkOutline,
  peopleOutline,
  cashOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class AdminDashboardPage implements OnInit {
  totalPlatformSales: number = 5420;
  activeVendorsCount: number = 12;
  commissionRate: number = 15;

  pendingProducts: any[] = [];

  constructor(private toastController: ToastController) {
    addIcons({
      shieldCheckmarkOutline,
      peopleOutline,
      cashOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
    });
  }

  ngOnInit() {
    this.loadPendingCatalog();
  }

  loadPendingCatalog() {
    const saved = localStorage.getItem('lavender_vendor_products');
    if (saved) {
      const allProducts = JSON.parse(saved);
      this.pendingProducts = allProducts.filter(
        (p: any) => p.status === 'pending',
      );
    } else {
      this.pendingProducts = [];
    }
  }

  approveVendor(product: any) {
    const saved = localStorage.getItem('lavender_vendor_products');
    if (saved) {
      let allProducts = JSON.parse(saved);
      let target = allProducts.find((p: any) => p.id === product.id);
      if (target) {
        target.status = 'approved';
        localStorage.setItem(
          'lavender_vendor_products',
          JSON.stringify(allProducts),
        );
        this.activeVendorsCount += 1;
        this.presentToast(`Node "${product.name}" approved live!`, 'success');
        this.loadPendingCatalog();
      }
    }
  }

  rejectVendor(product: any) {
    const saved = localStorage.getItem('lavender_vendor_products');
    if (saved) {
      let allProducts = JSON.parse(saved);
      allProducts = allProducts.filter((p: any) => p.id !== product.id);
      localStorage.setItem(
        'lavender_vendor_products',
        JSON.stringify(allProducts),
      );
      this.presentToast(`Product application rejected and purged.`, 'danger');
      this.loadPendingCatalog();
    }
  }

  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}
