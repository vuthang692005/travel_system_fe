import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';
import { ConfirmDialogData } from '../models/confirm-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private dialog = inject(MatDialog);

  /**
   * Mở hộp thoại xác nhận
   * @returns Promise<boolean> - Trả về true nếu nhấn Xác nhận, false nếu nhấn Hủy
   */
  async confirm(data: ConfirmDialogData): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      maxWidth: '400px',
      panelClass: 'custom-confirm-panel', // Bạn có thể thêm CSS để xóa background mặc định của Material
    });

    return (await firstValueFrom(dialogRef.afterClosed())) || false;
  }
}
