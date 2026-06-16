import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterLink } from '@angular/router';

// استيراد الأيقونات المستخدمة بما فيها الأيقونات الجديدة للفئات والألوان
import { addIcons } from 'ionicons';
import {
  storefrontOutline,
  addCircleOutline,
  cloudUploadOutline,
  cashOutline,
  hardwareChipOutline,
  timeOutline,
  cameraOutline,
  trashOutline,
  cubeOutline,
  closeCircle,
  addOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.page.html',
  styleUrls: ['./vendor-dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class VendorDashboardPage implements OnInit {
  // قائمة التصنيفات الافتراضية والعملية للمتجر
  categories: string[] = [
    'Smart Nodes',
    'Wearables',
    'Smart Home',
    'IoT Hubs',
    'Toolkits',
  ];

  // متغير مؤقت لربط حقل إدخال اللون الجديد
  colorInput: string = '';

  // البيانات الشخصية للبائع
  vendorNameInput: string = '';
  vendorPhoneInput: string = '';

  // كائن مجمع للمنتج الجديد يحتوي على مصفوفة الألوان والكمية الافتراضية (1) والكاتيجوري
  newProduct: any = {
    name: '',
    price: null,
    category: '',
    stock: 1,
    colors: [],
    description: '',
    icon: '',
  };

  // مصفوفة عرض المنتجات الخاصة بهذا البائع
  vendorProducts: any[] = [];

  constructor(private toastController: ToastController) {
    addIcons({
      storefrontOutline,
      addCircleOutline,
      cloudUploadOutline,
      cashOutline,
      hardwareChipOutline,
      timeOutline,
      cameraOutline,
      trashOutline,
      cubeOutline,
      closeCircle,
      addOutline,
    });
  }

  ngOnInit() {
    this.loadVendorProducts();
  }

  loadVendorProducts() {
    const saved = localStorage.getItem('lavender_vendor_products');
    if (saved) {
      this.vendorProducts = JSON.parse(saved);
    }
  }

  // 📈 دالة زيادة كمية التخزين من خلال عداد الـ HTML
  increaseStock() {
    this.newProduct.stock++;
  }

  // 📉 دالة تقليل كمية التخزين من خلال العداد بشرط ألا تقل عن 0
  decreaseStock() {
    if (this.newProduct.stock > 0) {
      this.newProduct.stock--;
    }
  }

  // 🎨 دالة إضافة لون جديد ديناميكياً للمصفوفة قبل الحفظ
  addColor() {
    if (this.colorInput && this.colorInput.trim() !== '') {
      // التأكد من عدم تكرار نفس اللون
      if (!this.newProduct.colors.includes(this.colorInput.trim())) {
        this.newProduct.colors.push(this.colorInput.trim());
      }
      this.colorInput = ''; // تصفية الحقل بعد الإضافة الناجحة
    }
  }

  // 🗑️ دالة حذف لون معين من الـ Chips المضافة
  removeColor(index: number) {
    this.newProduct.colors.splice(index, 1);
  }

  // 📸 دالة التقاط صورة حية للمنتج باستخدام الكاميرا
  async captureProductImage() {
    try {
      const video = document.createElement('video');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.newProduct.productImageUrl = canvas.toDataURL('image/jpeg');
          this.presentToast('Asset captured via Cam!', 'success');
        }
        stream.getTracks().forEach((track) => track.stop());
      }, 1200);
    } catch (error) {
      this.presentToast(
        'Camera stream unavailable. Please paste an asset URL.',
        'danger',
      );
    }
  }

  // 🚀 دالة نشر المنتج وحفظ البيانات كاملة بالـ LocalStorage
  async publishProduct() {
    if (
      !this.newProduct.name ||
      !this.newProduct.price ||
      !this.newProduct.category ||
      !this.vendorNameInput ||
      !this.vendorPhoneInput
    ) {
      this.presentToast(
        'All starred fields, including Category and Vendor Profile, are required!',
        'danger',
      );
      return;
    }

    const productToPublish = {
      id: Date.now().toString(),
      name: this.newProduct.name,
      price: this.newProduct.price,
      category: this.newProduct.category,
      stock: this.newProduct.stock,
      colors: this.newProduct.colors,
      description: this.newProduct.description,
      icon:
        this.newProduct.productImageUrl ||
        'https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?w=500',
      vendorName: this.vendorNameInput,
      vendorPhone: this.vendorPhoneInput,
      status: 'pending', // يذهب لانتظار موافقة الأدمن
    };

    this.vendorProducts.push(productToPublish);
    localStorage.setItem(
      'lavender_vendor_products',
      JSON.stringify(this.vendorProducts),
    );

    this.presentToast('Submitted to Admin Console for validation!', 'success');
    this.resetForm();
  }

  // 🗑️ دالة حذف منتج من قائمة البائع نهائياً
  deleteProduct(id: string) {
    this.vendorProducts = this.vendorProducts.filter((p) => p.id !== id);
    localStorage.setItem(
      'lavender_vendor_products',
      JSON.stringify(this.vendorProducts),
    );
    this.presentToast('Product purged from marketplace.', 'success');
  }

  // تصفية النموذج بالكامل لإعادته لحالته الافتراضية
  resetForm() {
    this.newProduct = {
      name: '',
      price: null,
      category: '',
      stock: 1,
      colors: [],
      description: '',
      icon: '',
    };
    this.vendorNameInput = '';
    this.vendorPhoneInput = '';
  }

  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'secondary',
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
    });
    await toast.present();
  }
}
