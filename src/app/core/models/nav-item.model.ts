export interface NavItem {
  label: string;
  icon: string;
  path?: string;
  children?: NavItem[];
  isOpen?: boolean; // Quản lý trạng thái đóng/mở của menu con
}
