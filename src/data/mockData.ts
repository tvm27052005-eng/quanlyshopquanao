import {
  Category,
  Product,
  Supplier,
  PurchaseOrder,
  Order,
  Voucher,
  User,
  Review,
  AuditLog,
  SystemNotification
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Áo Nam',
    slug: 'ao-nam',
    description: 'Áo sơ mi, áo thun, polo, áo khoác dành cho nam giới',
    productCount: 18
  },
  {
    id: 'cat-2',
    name: 'Quần Nam',
    slug: 'quan-nam',
    description: 'Quần jeans, quần tây, quần short, quần jogger nam',
    productCount: 14
  },
  {
    id: 'cat-3',
    name: 'Thời Trang Nữ',
    slug: 'thoi-trang-nu',
    description: 'Đầm xòe, váy công sở, áo kiểu, croptop, cardigan',
    productCount: 22
  },
  {
    id: 'cat-4',
    name: 'Áo Khoác & Vest',
    slug: 'ao-khoac-vest',
    description: 'Áo blazer, vest cao cấp, jacket chống nước, khoác dạ',
    productCount: 10
  },
  {
    id: 'cat-5',
    name: 'Phụ Kiện',
    slug: 'phu-kien',
    description: 'Thắt lưng da, nón kết, ví da, cà vạt, tất cao cấp',
    productCount: 8
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Áo Sơ Mi Nam Oxford Premium Cotton',
    slug: 'ao-so-mi-nam-oxford-premium-cotton',
    description: 'Áo sơ mi vải Oxford 100% Cotton thoáng mát, co giãn nhẹ, form Regular Fit chuẩn quý ông. Phù hợp đi làm công sở và đi chơi.',
    categoryId: 'cat-1',
    categoryName: 'Áo Nam',
    brand: 'FashionPro Studio',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80'
    ],
    basePrice: 450000,
    rating: 4.8,
    reviewCount: 32,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 349000,
    tags: ['Sơ mi', 'Oxford', 'Công sở', 'Cotton'],
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-07-20T10:00:00Z',
    variants: [
      {
        id: 'var-1-1',
        sku: 'SM-OXF-WHT-S',
        barcode: '893601234001',
        color: 'Trắng',
        colorHex: '#FFFFFF',
        size: 'S',
        price: 349000,
        originalPrice: 450000,
        stock: 25,
        reservedStock: 2
      },
      {
        id: 'var-1-2',
        sku: 'SM-OXF-WHT-M',
        barcode: '893601234002',
        color: 'Trắng',
        colorHex: '#FFFFFF',
        size: 'M',
        price: 349000,
        originalPrice: 450000,
        stock: 40,
        reservedStock: 5
      },
      {
        id: 'var-1-3',
        sku: 'SM-OXF-WHT-L',
        barcode: '893601234003',
        color: 'Trắng',
        colorHex: '#FFFFFF',
        size: 'L',
        price: 349000,
        originalPrice: 450000,
        stock: 30,
        reservedStock: 1
      },
      {
        id: 'var-1-4',
        sku: 'SM-OXF-NVY-M',
        barcode: '893601234004',
        color: 'Xanh Navy',
        colorHex: '#1B2A4A',
        size: 'M',
        price: 349000,
        originalPrice: 450000,
        stock: 18,
        reservedStock: 0
      },
      {
        id: 'var-1-5',
        sku: 'SM-OXF-NVY-L',
        barcode: '893601234005',
        color: 'Xanh Navy',
        colorHex: '#1B2A4A',
        size: 'L',
        price: 349000,
        originalPrice: 450000,
        stock: 22,
        reservedStock: 2
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Áo Thun Polo Pique Coolmate Anti-Bacterial',
    slug: 'ao-thun-polo-pique-coolmate',
    description: 'Áo polo nam vải dệt Pique cổ điển, công nghệ kháng khuẩn Ion Bạc vượt trội, chống nhăn, giữ form cổ áo cực đẹp.',
    categoryId: 'cat-1',
    categoryName: 'Áo Nam',
    brand: 'FashionPro Studio',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80'
    ],
    basePrice: 290000,
    rating: 4.9,
    reviewCount: 54,
    isFeatured: true,
    isFlashSale: false,
    tags: ['Polo', 'Pique', 'Kháng khuẩn', 'Thun'],
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-07-22T10:00:00Z',
    variants: [
      {
        id: 'var-2-1',
        sku: 'POLO-BLK-M',
        barcode: '893601234010',
        color: 'Đen Tuyền',
        colorHex: '#000000',
        size: 'M',
        price: 290000,
        originalPrice: 350000,
        stock: 50,
        reservedStock: 3
      },
      {
        id: 'var-2-2',
        sku: 'POLO-BLK-L',
        barcode: '893601234011',
        color: 'Đen Tuyền',
        colorHex: '#000000',
        size: 'L',
        price: 290000,
        originalPrice: 350000,
        stock: 35,
        reservedStock: 0
      },
      {
        id: 'var-2-3',
        sku: 'POLO-BEI-M',
        barcode: '893601234012',
        color: 'Beige',
        colorHex: '#D7C4B7',
        size: 'M',
        price: 290000,
        originalPrice: 350000,
        stock: 15,
        reservedStock: 1
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Quần Jeans Slim-Fit Co Giãn Dáng Đứng',
    slug: 'quan-jeans-slim-fit-co-gian',
    description: 'Quần Jeans nam dáng Slim-Fit ôm vừa vặn đôi chân, chất liệu Denim Cotton Spandex co giãn 4 chiều mềm mại, nhuộm màu chống phai.',
    categoryId: 'cat-2',
    categoryName: 'Quần Nam',
    brand: 'Denim Craft',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-780c36856842?w=600&auto=format&fit=crop&q=80'
    ],
    basePrice: 590000,
    rating: 4.7,
    reviewCount: 19,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 429000,
    tags: ['Jeans', 'Denim', 'Slim fit', 'Co giãn'],
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-07-21T10:00:00Z',
    variants: [
      {
        id: 'var-3-1',
        sku: 'JNS-BLU-S',
        barcode: '893601234020',
        color: 'Xanh Indigo',
        colorHex: '#254E70',
        size: 'S',
        price: 429000,
        originalPrice: 590000,
        stock: 12,
        reservedStock: 0
      },
      {
        id: 'var-3-2',
        sku: 'JNS-BLU-M',
        barcode: '893601234021',
        color: 'Xanh Indigo',
        colorHex: '#254E70',
        size: 'M',
        price: 429000,
        originalPrice: 590000,
        stock: 28,
        reservedStock: 2
      },
      {
        id: 'var-3-3',
        sku: 'JNS-BLU-L',
        barcode: '893601234022',
        color: 'Xanh Indigo',
        colorHex: '#254E70',
        size: 'L',
        price: 429000,
        originalPrice: 590000,
        stock: 4, // Low stock warning
        reservedStock: 1
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Đầm Xòe Nữ Công Sở Vải Silk Lụa Tơ Tằm',
    slug: 'dam-xoe-nu-cong-so-silk-lua',
    description: 'Đầm xòe lụa tơ tằm mềm mại, thiết kế thắt eo tôn dáng thanh lịch, phù hợp dự tiệc và môi trường công sở sang trọng.',
    categoryId: 'cat-3',
    categoryName: 'Thời Trang Nữ',
    brand: 'Elegance Paris',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80'
    ],
    basePrice: 850000,
    rating: 4.9,
    reviewCount: 41,
    isFeatured: true,
    isFlashSale: false,
    tags: ['Đầm', 'Lụa', 'Công sở', 'Thời trang nữ'],
    createdAt: '2026-06-18T10:00:00Z',
    updatedAt: '2026-07-23T10:00:00Z',
    variants: [
      {
        id: 'var-4-1',
        sku: 'DRS-RED-S',
        barcode: '893601234030',
        color: 'Đỏ Đô',
        colorHex: '#8B0000',
        size: 'S',
        price: 850000,
        originalPrice: 1100000,
        stock: 15,
        reservedStock: 1
      },
      {
        id: 'var-4-2',
        sku: 'DRS-RED-M',
        barcode: '893601234031',
        color: 'Đỏ Đô',
        colorHex: '#8B0000',
        size: 'M',
        price: 850000,
        originalPrice: 1100000,
        stock: 20,
        reservedStock: 0
      },
      {
        id: 'var-4-3',
        sku: 'DRS-CRM-S',
        barcode: '893601234032',
        color: 'Kem Lụa',
        colorHex: '#FFFDD0',
        size: 'S',
        price: 850000,
        originalPrice: 1100000,
        stock: 8,
        reservedStock: 0
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Áo Khoác Blazer Nam Form Hàn Quốc Modern Cut',
    slug: 'ao-khoac-blazer-nam-form-han-quoc',
    description: 'Blazer nam phong cách Hàn Quốc trẻ trung, vải Wool Blend đứng dáng, lót lụa thông thoáng. Dễ phối với áo thun hoặc áo sơ mi.',
    categoryId: 'cat-4',
    categoryName: 'Áo Khoác & Vest',
    brand: 'FashionPro Studio',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80'
    ],
    basePrice: 1250000,
    rating: 5.0,
    reviewCount: 28,
    isFeatured: true,
    isFlashSale: true,
    flashSalePrice: 990000,
    tags: ['Blazer', 'Vest', 'Hàn Quốc', 'Chính hãng'],
    createdAt: '2026-06-20T10:00:00Z',
    updatedAt: '2026-07-23T10:00:00Z',
    variants: [
      {
        id: 'var-5-1',
        sku: 'BLZ-GRY-M',
        barcode: '893601234040',
        color: 'Xám Ghi',
        colorHex: '#808080',
        size: 'M',
        price: 990000,
        originalPrice: 1250000,
        stock: 10,
        reservedStock: 1
      },
      {
        id: 'var-5-2',
        sku: 'BLZ-GRY-L',
        barcode: '893601234041',
        color: 'Xám Ghi',
        colorHex: '#808080',
        size: 'L',
        price: 990000,
        originalPrice: 1250000,
        stock: 14,
        reservedStock: 2
      },
      {
        id: 'var-5-3',
        sku: 'BLZ-BLK-L',
        barcode: '893601234042',
        color: 'Đen',
        colorHex: '#111111',
        size: 'L',
        price: 990000,
        originalPrice: 1250000,
        stock: 3, // Low stock
        reservedStock: 0
      }
    ]
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    code: 'SUP-MAY10',
    name: 'Tổng Công ty May 10 - JSC',
    contactPerson: 'Nguyễn Văn Hùng',
    phone: '02438271010',
    email: 'kinhdoanh@may10.vn',
    address: 'Sài Đồng, Long Biên, Hà Nội',
    taxCode: '0100100100',
    status: 'ACTIVE'
  },
  {
    id: 'sup-2',
    code: 'SUP-VIETTIEN',
    name: 'Công ty Cổ phần Bán hàng Việt Tiến',
    contactPerson: 'Trần Thị Mai',
    phone: '02838640800',
    email: 'contact@viettien.com.vn',
    address: '07 Lê Minh Xuân, Q. Tân Bình, TP. HCM',
    taxCode: '0300800900',
    status: 'ACTIVE'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-001',
    supplierId: 'sup-1',
    supplierName: 'Tổng Công ty May 10 - JSC',
    items: [
      {
        productId: 'prod-1',
        variantId: 'var-1-1',
        productName: 'Áo Sơ Mi Nam Oxford Premium Cotton',
        sku: 'SM-OXF-WHT-S',
        color: 'Trắng',
        size: 'S',
        quantity: 50,
        importPrice: 210000
      },
      {
        productId: 'prod-1',
        variantId: 'var-1-2',
        productName: 'Áo Sơ Mi Nam Oxford Premium Cotton',
        sku: 'SM-OXF-WHT-M',
        color: 'Trắng',
        size: 'M',
        quantity: 50,
        importPrice: 210000
      }
    ],
    totalAmount: 21000000,
    status: 'RECEIVED',
    createdBy: 'Trần Quản Lý',
    receivedAt: '2026-07-15T14:30:00Z',
    createdAt: '2026-07-10T09:00:00Z',
    notes: 'Nhập lô hàng sơ mi Oxford chuẩn bị cho đợt Sale tháng 7'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Nguyễn Văn Admin',
    email: 'admin@fashionpro.vn',
    phone: '0901234567',
    role: 'ADMIN',
    isVerified: true,
    points: 1250,
    loyaltyTier: 'DIAMOND',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-manager',
    name: 'Lê Thị Quản Lý',
    email: 'manager@fashionpro.vn',
    phone: '0912345678',
    role: 'MANAGER',
    isVerified: true,
    points: 600,
    loyaltyTier: 'GOLD',
    createdAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 'user-staff',
    name: 'Phạm Văn Bán Hàng',
    email: 'staff@fashionpro.vn',
    phone: '0923456789',
    role: 'STAFF',
    isVerified: true,
    points: 150,
    loyaltyTier: 'SILVER',
    createdAt: '2026-03-01T00:00:00Z'
  },
  {
    id: 'user-cust-1',
    name: 'Đặng Hoàng Nam',
    email: 'hoangnam@gmail.com',
    phone: '0987654321',
    role: 'CUSTOMER',
    isVerified: true,
    points: 380,
    loyaltyTier: 'GOLD',
    createdAt: '2026-04-15T00:00:00Z'
  }
];

export const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v-1',
    code: 'FASHION50K',
    description: 'Giảm 50,000đ cho đơn hàng từ 300,000đ',
    discountType: 'FIXED',
    discountValue: 50000,
    minOrderValue: 300000,
    usageLimit: 100,
    usageCount: 24,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    isActive: true
  },
  {
    id: 'v-2',
    code: 'HELLOSUMMER',
    description: 'Giảm 15% tổng hóa đơn (Tối đa 100,000đ)',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 500000,
    maxDiscount: 100000,
    usageLimit: 200,
    usageCount: 88,
    startDate: '2026-07-15',
    endDate: '2026-08-15',
    isActive: true,
    isFlashSale: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderCode: 'FP2026072301',
    customerId: 'user-cust-1',
    customerName: 'Đặng Hoàng Nam',
    customerPhone: '0987654321',
    customerEmail: 'hoangnam@gmail.com',
    shippingAddress: '123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh',
    items: [
      {
        productId: 'prod-1',
        productName: 'Áo Sơ Mi Nam Oxford Premium Cotton',
        variantId: 'var-1-2',
        sku: 'SM-OXF-WHT-M',
        color: 'Trắng',
        size: 'M',
        price: 349000,
        quantity: 2
      }
    ],
    subtotal: 698000,
    discountAmount: 50000,
    voucherCode: 'FASHION50K',
    shippingFee: 30000,
    totalAmount: 678000,
    status: 'SHIPPING',
    paymentMethod: 'VNPAY',
    paymentStatus: 'PAID',
    notes: 'Giao giờ hành chính giúp tôi',
    source: 'ONLINE',
    createdAt: '2026-07-22T08:30:00Z',
    updatedAt: '2026-07-23T10:00:00Z',
    history: [
      {
        status: 'PENDING',
        updatedBy: 'Khách hàng',
        timestamp: '2026-07-22T08:30:00Z',
        note: 'Đơn hàng được khởi tạo qua Website'
      },
      {
        status: 'CONFIRMED',
        updatedBy: 'Lê Thị Quản Lý',
        timestamp: '2026-07-22T09:15:00Z',
        note: 'Đã xác nhận thanh toán VNPay thành công'
      },
      {
        status: 'PACKING',
        updatedBy: 'Phạm Văn Bán Hàng',
        timestamp: '2026-07-22T14:00:00Z',
        note: 'Sản phẩm đã đóng gói dán mã vận đơn'
      },
      {
        status: 'SHIPPING',
        updatedBy: 'Giao Hàng Nhanh (GHN)',
        timestamp: '2026-07-23T08:00:00Z',
        note: 'Shipper đang lấy hàng'
      }
    ]
  },
  {
    id: 'ord-1002',
    orderCode: 'FP2026072302',
    customerId: 'user-cust-1',
    customerName: 'Nguyễn Thu Trang',
    customerPhone: '0911223344',
    customerEmail: 'thutrang@gmail.com',
    shippingAddress: '456 Lê Duẩn, Quận Hai Bà Trưng, Hà Nội',
    items: [
      {
        productId: 'prod-4',
        productName: 'Đầm Xòe Nữ Công Sở Vải Silk Lụa Tơ Tằm',
        variantId: 'var-4-1',
        sku: 'DRS-RED-S',
        color: 'Đỏ Đô',
        size: 'S',
        price: 850000,
        quantity: 1
      }
    ],
    subtotal: 850000,
    discountAmount: 100000,
    voucherCode: 'HELLOSUMMER',
    shippingFee: 0,
    totalAmount: 750000,
    status: 'DELIVERED',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    source: 'ONLINE',
    createdAt: '2026-07-21T15:20:00Z',
    updatedAt: '2026-07-23T11:00:00Z',
    history: [
      {
        status: 'DELIVERED',
        updatedBy: 'Shipper ViettelPost',
        timestamp: '2026-07-23T11:00:00Z',
        note: 'Khách hàng đã nhận và thanh toán xong'
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-cust-1',
    userName: 'Đặng Hoàng Nam',
    rating: 5,
    comment: 'Áo chất vải Oxford dày dặn chuẩn form, mặc lên dáng rất lịch sự. Đóng gói cẩn thận có hộp đẹp!',
    likes: 12,
    isVerifiedPurchase: true,
    createdAt: '2026-07-20T16:00:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    userId: 'user-cust-2',
    userName: 'Minh Anh',
    rating: 5,
    comment: 'Áo polo thoáng mát, không bị nhão cổ sau khi giặt máy. Màu đen tuyền rất chuẩn.',
    likes: 8,
    isVerifiedPurchase: true,
    createdAt: '2026-07-21T09:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'user-admin',
    userName: 'Nguyễn Văn Admin',
    userRole: 'ADMIN',
    action: 'CREATE_PRODUCT',
    entity: 'Product',
    entityId: 'prod-1',
    ipAddress: '113.161.45.12',
    details: 'Tạo sản phẩm mới "Áo Sơ Mi Nam Oxford Premium Cotton" với 5 biến thể',
    timestamp: '2026-06-01T10:00:00Z'
  },
  {
    id: 'log-2',
    userId: 'user-manager',
    userName: 'Lê Thị Quản Lý',
    userRole: 'MANAGER',
    action: 'RECEIVE_PO',
    entity: 'PurchaseOrder',
    entityId: 'po-101',
    ipAddress: '118.69.182.90',
    details: 'Xác nhận nhập kho phiếu PO-2026-001 (100 sản phẩm từ May 10)',
    timestamp: '2026-07-15T14:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Đơn hàng mới #FP2026072301',
    message: 'Khách hàng Đặng Hoàng Nam vừa đặt đơn hàng giá trị 678,000đ qua VNPay.',
    type: 'ORDER',
    recipientRole: 'STAFF',
    isRead: true,
    createdAt: '2026-07-22T08:30:00Z'
  },
  {
    id: 'notif-2',
    title: 'Cảnh báo tồn kho thấp',
    message: 'Biến thể JNS-BLU-L (Quần Jeans Slim-Fit) chỉ còn 4 sản phẩm trong kho.',
    type: 'STOCK',
    recipientRole: 'MANAGER',
    isRead: true,
    createdAt: '2026-07-23T07:00:00Z'
  }
];
