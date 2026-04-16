export interface PaymentPayload {
  orderType: string;
  amount: number;
  orderDescription: string;
  name: string;
}
export interface CashBookingPayload {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
  roomId: number;
  hotelName: string;
  hotelAddress: string;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  orderDescription: string;
}
export interface SendReceiptPayload {
  email: string;
  name: string;
  userId: string;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  transactionId: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  orderDescription: string;
}
