# 🛍️ FashionPro Enterprise - Hệ Thống Quản Lý Bán Hàng Thời Trang POS & E-Commerce

Dự án website quản lý cửa hàng bán quần áo chuyên nghiệp, tích hợp Cửa hàng trực tuyến (Online Storefront), Quầy thu ngân bán hàng tại chỗ (POS Counter), Báo cáo doanh thu Real-Time và Quản trị hệ thống (Inventory/Employees/Suppliers/Vouchers).

---

## 🚀 Hướng Dẫn Chạy Dự Án Dành Cho Bạn Bè (Quick Start Guide)

### 📌 Yêu cầu môi trường:
- **Node.js** (Phiên bản 18, 20 hoặc 22+)
- **Git**

---

### 📥 Bước 1: Tải Mã Nguồn Về Máy (Clone Repository)
Mở **Command Prompt**, **PowerShell** hoặc **Terminal** và chạy các lệnh sau:

```bash
git clone https://github.com/tvm27052005-eng/quanlyshopquanao.git
cd quanlyshopquanao
```

---

### 📦 Bước 2: Cài Đặt Thư Viện (Install Dependencies)

Chạy lệnh cài đặt thư viện:

```bash
npm install --legacy-peer-deps
```

> **Lưu ý:** Nếu gặp bất kỳ lỗi xung đột phiên bản `peer dependency`, sử dụng đúng cờ `--legacy-peer-deps` như trên.

---

### ⚡ Bước 3: Khởi Chạy Ứng Dụng (Run Project)

Chạy lệnh khởi động máy chủ & giao diện:

```bash
npm run dev
```

Sau khi máy chủ báo: `🚀 FashionPro Enterprise Server is listening on http://localhost:3000`, hãy mở trình duyệt web và truy cập:

👉 **`http://localhost:3000`**

---

## 💡 Lưu Ý Quan Trọng Về Cơ Sở Dữ Liệu (MongoDB)

- **Nếu máy bạn ĐÃ cài MongoDB**: Hệ thống sẽ tự động kết nối CSDL MongoDB tại `mongodb://127.0.0.1:27017/fashionpro` và tự động nạp (Auto-Seed) bộ dữ liệu mẫu ban đầu.
- **Nếu máy bạn CHƯA cài MongoDB**: Đừng lo lắng! Ứng dụng sẽ tự động chạy ở chế độ **In-Memory Cache (Bộ nhớ tạm)** với đầy đủ dữ liệu mẫu để bạn chạy thử nghiệm mượt mà không bị lỗi.

---

## 🔐 Tài Khoản Mẫu Để Thử Nghiệm Phân Quyền (RBAC)

Bấm nút **Đăng Nhập** ở góc phải thanh Header -> Chọn **"Thử nghiệm đăng nhập theo phân quyền"**:

| Vai Trò (Role) | Email | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **Quản Trị (Admin)** | `admin@fashionpro.vn` | `123456` | Toàn quyền Quản trị, Xem báo cáo doanh thu, Quản lý kho & Nhân viên |
| **Quản Lý (Manager)** | `manager@fashionpro.vn` | `123456` | Quản lý sản phẩm, đơn hàng POS/Online & kho hàng |
| **Bán Hàng (Staff)** | `staff@fashionpro.vn` | `123456` | Thao tác Quầy bán hàng POS, lập hóa đơn & in receipt 80mm |
| **Khách Hàng (Customer)**| `hoangnam@gmail.com` | `123456` | Đặt hàng Storefront, xem lịch sử mua & tích điểm VIP |
