export interface CreatePaymentRes {
  paymentUrl: string;
}

export interface CashBookingRes {
  success: boolean;
  reservationId: number;
  emailSent: boolean;
  message: string;
}
export interface SendReceiptRes {
  success: boolean;
  reservationId: number;
  emailSent: boolean;
  message: string;
}
