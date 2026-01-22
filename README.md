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
│   │   │   └── authService.ts  # Chứa các dịch vụ dùng trong Module (nếu dùng trong nhiều moudle thì để trong core)
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
