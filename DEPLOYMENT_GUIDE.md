# Hướng Dẫn Đẩy Dự Án Bán Quần Áo Lên Web Thực Tế (Production Deployment Guide)

Tài liệu này hướng dẫn chi tiết từng bước đưa dự án **FashionPro Enterprise** lên internet để bất kỳ ai cũng có thể truy cập được thông qua tên miền (URL trên Google).

---

## MỤC LỤC
1. [Bước 1: Tạo Database MongoDB Atlas Miễn Phí (Đám mây)](#1-bước-1-tạo-database-mongodb-atlas-miễn-phí)
2. [Bước 2: Đẩy Code Lên GitHub](#2-bước-2-đẩy-code-lên-github)
3. [Bước 3: Triển Khai Web App Lên Render.com (Khuyên Dùng & Miễn Phí)](#3-bước-3-triển-khai-web-app-lên-rendercom)
4. [Bước 4: Kiểm Tra & Trải Nghiệm Website Thực Tế](#4-bước-4-kiểm-tra--trải-nghiệm-website-thực-tế)

---

### 1. BƯỚC 1: TẠO DATABASE MONGODB ATLAS MIỄN PHÍ

1. Truy cập [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) và đăng ký tài khoản (Free Cluster).
2. Tạo mới một Cluster (Chọn gói **M0 Free**).
3. Vào mục **Database Access** -> Tạo một User kết nối CSDL (VD: username `admin_fashion`, password `SecuredPassword123`).
4. Vào mục **Network Access** -> Thêm địa chỉ IP: Chọn `Allow Access from Anywhere` (`0.0.0.0/0`).
5. Click **Connect** -> **Drivers** -> Copy chuỗi kết nối URI có dạng:
   ```env
   mongodb+srv://admin_fashion:<password>@cluster0.abcde.mongodb.net/fashionpro?retryWrites=true&w=majority
   ```
   *(Thay `<password>` bằng mật khẩu vừa tạo).*

---

### 2. BƯỚC 2: ĐẨY CODE LÊN GITHUB

Mở Terminal trong thư mục dự án và chạy các lệnh:
```bash
git init
git add .
git commit -m "Deploy FashionPro App with MongoDB integration"
git branch -M main
git remote add origin https://github.com/Tên_Tài_Khoản_Của_Bạn/quan_ly_ban_quanao.git
git push -u origin main
```

---

### 3. BƯỚC 3: TRIỂN KHAI WEB APP LÊN RENDER.COM (TỰ ĐỘNG BUILD & DEPLOY)

[Render.com](https://render.com) hỗ trợ Host ứng dụng Node.js Full-stack hoàn toàn miễn phí.

1. Đăng ký/Đăng nhập [https://render.com](https://render.com) bằng tài khoản GitHub.
2. Tại trang Dashboard, chọn **New +** -> Select **Web Service**.
3. Kết nối với Repository GitHub `quan_ly_ban_quanao` vừa đẩy lên.
4. Điền các thông tin cấu hình:
   * **Name**: `fashionpro-shop` (Tên trang web của bạn)
   * **Region**: Singapore (Hoặc vị trí gần nhất)
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Build Command**:
     ```bash
     npm install && npm run build
     ```
   * **Start Command**:
     ```bash
     npm run start
     ```
5. Mở mục **Environment Variables** (Biến môi trường) -> Thêm các dòng sau:
   * `MONGODB_URI`: `<Chuỗi kết nối MongoDB Atlas từ Bước 1>`
   * `NODE_ENV`: `production`
   * `GEMINI_API_KEY`: `<API Key Gemini nếu sử dụng tính năng AI>`
6. Nhấn nút **Create Web Service**. Render sẽ tự động build và cấp cho bạn đường dẫn URL thực tế (Ví dụ: `https://fashionpro-shop.onrender.com`).

---

### 4. BƯỚC 4: KIỂM TRA & TRẢI NGHIỆM WEBSITE THỰC TẾ

- Nhấp vào liên kết đường dẫn từ Render.
- Hệ thống sẽ kết nối với MongoDB Atlas và **tự động nạp toàn bộ dữ liệu sản phẩm, danh mục, đơn hàng mẫu ban đầu**.
- Bạn có thể gửi liên kết website này cho người khác dùng thử, trải nghiệm xem hàng, đặt hàng trực tuyến hoặc đăng nhập trang Admin quản lý!
