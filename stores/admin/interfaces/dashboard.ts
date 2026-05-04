export interface RevenueChart {
  year: number;
  month: number;
  monthName: string;
  revenue: number;
  reservationCount: number;
}

export interface TopHotel {
  hotelId: number;
  name: string;
  cityName: string;
  imgUrl: string | null;
  reservationCount: number;
  revenue: number;
  averageRating: number;
}

export interface RecentBooking {
  reservationId: number;
  bookingCode: string;
  hotelName: string;
  hotelImage: string | null;
  cityName: string;
  guestName: string;
  guestAvatar: string | null;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  status: string;
}

export interface PopularCity {
  cityId: number;
  name: string;
  hotelCount: number;
  bookingCount: number;
  percentage: number;
}

export interface RecentActivity {
  message: string;
  time: string;
  type: string;
}

export interface DashboardData {
  totalUsers: number;
  totalHotels: number;
  totalCities: number;
  totalRooms: number;
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  totalRevenue: number;
  revenueThisMonth: number;
  averageRating: number;
  revenueChart: RevenueChart[];
  topHotels: TopHotel[];
  recentBookings: RecentBooking[];
  popularCities: PopularCity[];
  recentActivities: RecentActivity[];
}

export interface DashboardResponse {
  success: boolean;
  message: string | null;
  data: DashboardData;
  errors: string[] | null;
}
