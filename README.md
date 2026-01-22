## 📂 Sơ đồ cấu trúc thư mục

```text
src/
├── app/
│   ├── core/                   # Các thành phần dùng toàn cục, chỉ import 1 lần trong app.config.ts
│   │   ├── guards/             # Kiểm soát quyền truy cập các route
│   │   ├── interceptors/       # Xử lý HTTP requests/responses (Token, Error handling,...)
│   │   └── services/           # Các dịch vụ dùng chung xuyên suốt app
│   ├── layouts/                # Chứa các khung giao diện chính (AuthLayout, HomeLayout, ..)
│   ├── features/               # Chứa các Module chức năng nghiệp vụ
│   │   ├── auth/               # Module xác thực (Login, Register)
│   │   │   ├── components/     # Các UI components nhỏ dùng riêng cho Auth
│   │   │   ├── pages/          # Các component đại diện cho một trang hoàn chỉnh
│   │   │   └── service/        # Chứa các dịch vụ dùng trong Module (nếu dùng trong nhiều module thì để trong core)
│   │   ├── home/               # Module trang chủ
│   │   └── .../                # Module khác
│   ├── shared/                 # Các thành phần tái sử dụng ở nhiều nơi
│   │   ├── components/         # UI chung (Button, Loading, Modal,...)
│   │   ├── directives/         # Các directive dùng chung
│   │   └── pipes/              # Các pipe xử lý định dạng dữ liệu (format-date.ts, currency-vnd.ts)
│   ├── store/                  # Quản lý State (State Management - RxJS/Signals)
│   ├── app.config.ts           # Cấu hình chính của ứng dụng
│   ├── app.routes.ts           # Định nghĩa hệ thống Routing
│   ├── app.ts / .html          # Root Component
├── public/                     # Assets tĩnh (Ảnh, Icons, Fonts)
├── main.ts                     # Điểm khởi chạy ứng dụng
└── index.html                  # File HTML gốc
```

## 🛠 Quy định viết Code

### 1. Angular Control Flow (Cú pháp mới)

- Yêu cầu: Tuyệt đối không sử dụng CommonModule (*ngIf, *ngFor, \*ngSwitch) cho các logic hiển thị.

- Thay thế: Sử dụng cú pháp Built-in Control Flow (@if, @for, @switch) được giới thiệu từ Angular 17+.

- Lý do: Cải thiện tốc độ render, template sạch hơn và không cần import directive thủ công.

### 2. Kiến trúc Standalone

- Yêu cầu: Dự án chỉ sử dụng Standalone Components/Directives/Pipes.

- Cấm: Không tạo thêm bất kỳ NgModule mới nào.

- Lưu ý: Mọi dependency cần thiết phải được khai báo trực tiếp trong mảng imports của từng Component.

### 3. Tiêu chuẩn Styling (Tailwind CSS)

- Mặc định: Sử dụng Tailwind CSS (Utility-first) để xây dựng giao diện.

- CSS Global: Không viết CSS trong styles.css hoặc các file CSS local nếu có thể giải quyết được bằng Tailwind.

- Trường hợp ngoại lệ: Chỉ viết CSS tùy chỉnh khi cần xử lý các Animation phức tạp hoặc ghi đè (override) style của các thư viện UI (như Angular Material) mà Tailwind không hỗ trợ tốt.

### 4. API & Services

- Tuyệt đối không gọi `HttpClient` trực tiếp trong Component. Mọi logic tương tác dữ liệu phải được đóng gói trong lớp Service.

- Sử dụng `core/services/` cho các logic dùng chung toàn hệ thống.

- Sử dụng `features/[tên-module]/services/` cho các logic đặc thù của từng tính năng."
