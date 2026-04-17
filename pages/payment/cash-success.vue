<template>
  <div
    class="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4 sm:p-6"
  >
    <div ref="receiptRef" class="w-full max-w-md sm:max-w-lg">
      <Card class="shadow-lg">
        <template #header>
          <div
            class="flex flex-col items-center pt-6 sm:pt-8 pb-3 sm:pb-4 bg-linear-to-b from-emerald-50 to-transparent dark:from-emerald-950/20 px-4"
          >
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3 sm:mb-4 ring-4 ring-emerald-200 dark:ring-emerald-800/50"
            >
              <i
                class="pi pi-wallet text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400"
              ></i>
            </div>
            <Tag severity="success" class="mb-2 text-xs sm:text-sm">
              <i class="pi pi-verified mr-1"></i>
              Đặt phòng thành công
            </Tag>
            <h1
              class="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-0 text-center"
            >
              Thanh toán tại quầy lễ tân
            </h1>
            <p
              class="text-sm text-surface-500 dark:text-surface-400 mt-1 text-center"
            >
              Vui lòng thanh toán khi nhận phòng
            </p>
          </div>
        </template>

        <template #content>
          <!-- Amount -->
          <div
            class="text-center py-4 sm:py-6 mb-4 sm:mb-6 bg-surface-100 dark:bg-surface-800 rounded-xl"
          >
            <span
              class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 uppercase tracking-wider block mb-1"
              >Số tiền cần thanh toán tại khách sạn</span
            >
            <span
              class="text-2xl sm:text-4xl font-bold text-surface-900 dark:text-surface-0"
              >{{ formattedAmount }}</span
            >
            <span
              class="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400 ml-1 sm:ml-2"
              >VND</span
            >
          </div>

          <!-- Info notice -->
          <div
            class="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 sm:p-4 mb-4"
          >
            <i class="pi pi-info-circle text-blue-500 mt-0.5 shrink-0"></i>
            <p class="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              Vui lòng xuất trình mã đặt phòng khi làm thủ tục check-in. Nhân
              viên lễ tân sẽ tiến hành thu phí tại chỗ.
            </p>
          </div>

          <!-- Booking details -->
          <div
            class="space-y-0 divide-y divide-surface-200 dark:divide-surface-700 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden text-sm"
          >
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Mã đặt phòng</span
              >
              <span
                class="text-xs sm:text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-widest"
              >
                {{ bookingData.reservationId }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Tên khách</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200"
              >
                {{ bookingData.name }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Khách sạn</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200 sm:text-right sm:max-w-[200px]"
              >
                {{ bookingData.hotelName }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Địa chỉ</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200 sm:text-right sm:max-w-[200px]"
              >
                {{ bookingData.hotelAddress }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Loại phòng</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200"
              >
                {{ bookingData.orderDescription }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Check-in</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200"
              >
                {{ formatDate(bookingData.checkInDate) }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Check-out</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200"
              >
                {{ formatDate(bookingData.checkOutDate) }}
              </span>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Phương thức thanh toán</span
              >
              <Tag value="Tiền mặt" severity="warning" class="w-fit">
                <i class="pi pi-wallet mr-1"></i>
                Tiền mặt tại quầy
              </Tag>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Trạng thái</span
              >
              <Tag severity="success" class="w-fit">
                <i class="pi pi-check-circle mr-1"></i>
                Đã xác nhận
              </Tag>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                label="Về trang chủ"
                icon="pi pi-home"
                @click="goHome"
                class="flex-1"
                size="small"
              />
              <Button
                label="Xuất PDF"
                icon="pi pi-file-pdf"
                severity="success"
                @click="exportPDF"
                :loading="isExporting"
                class="flex-1"
                size="small"
              />
              <Button
                label="In"
                icon="pi pi-print"
                severity="secondary"
                outlined
                @click="printReceipt"
                class="flex-1"
                size="small"
              />
            </div>
            <p
              class="text-center text-xs sm:text-sm text-surface-400 dark:text-surface-500"
            >
              <i class="pi pi-envelope mr-1"></i>
              Xác nhận đặt phòng đã được gửi đến email của bạn
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Tag from "primevue/tag";
import Button from "primevue/button";
import jsPDF from "jspdf";

const { t } = useI18n();

useHead({
  title: t("Đặt phòng thành công"),
});

definePageMeta({
  layout: false,
});

const router = useRouter();
const isExporting = ref(false);
const receiptRef = ref<HTMLElement | null>(null);

const bookingData = computed(() => {
  if (import.meta.client) {
    const stored = sessionStorage.getItem("cashBookingResponse");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        reservationId: parsed.reservationId ?? "N/A",
        name: parsed.name ?? "",
        hotelName: parsed.hotelName ?? "",
        hotelAddress: parsed.hotelAddress ?? "",
        orderDescription: parsed.orderDescription ?? "",
        checkInDate: parsed.checkInDate ?? "",
        checkOutDate: parsed.checkOutDate ?? "",
        amount: parsed.amount ?? 0,
        emailSent: parsed.emailSent ?? false,
        message: parsed.message ?? "",
      };
    }
  }

  // Fallback demo
  return {
    reservationId: "RES-20260417-001",
    name: "Nguyen Van A",
    hotelName: "SAM Hotel and Apartment Danang",
    hotelAddress: "123 Nguyen Van Linh, Da Nang",
    orderDescription: "King Suite with Balcony",
    checkInDate: "2026-03-07",
    checkOutDate: "2026-03-08",
    amount: 1000000,
    emailSent: true,
    message: "",
  };
});

const formattedAmount = computed(() =>
  new Intl.NumberFormat("vi-VN").format(bookingData.value.amount),
);

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

onMounted(() => {
  sessionStorage.removeItem("cashBookingResponse");
  history.replaceState(null, "", "/payment/cash-success");
  window.addEventListener("popstate", handlePopState);
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});

function handlePopState() {
  router.replace("/");
}

function goHome() {
  router.push("/");
}

function printReceipt() {
  window.print();
}

async function exportPDF() {
  isExporting.value = true;
  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    pdf.setFontSize(22);
    pdf.setTextColor(16, 185, 129); // emerald-500
    pdf.text("DAT PHONG THANH CONG", pageWidth / 2, y, { align: "center" });

    y += 12;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128);
    pdf.text("Thanh toan tien mat tai khach san", pageWidth / 2, y, {
      align: "center",
    });

    y += 10;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 15;
    pdf.setFontSize(13);
    pdf.setTextColor(107, 114, 128);
    pdf.text("So tien can thanh toan tai khach san:", margin, y);

    y += 10;
    pdf.setFontSize(26);
    pdf.setTextColor(17, 24, 39);
    pdf.text(`${formattedAmount.value} VND`, margin, y);

    y += 10;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;
    pdf.setFontSize(11);

    const details = [
      { label: "Ma dat phong", value: String(bookingData.value.reservationId) },
      { label: "Ten khach", value: bookingData.value.name },
      { label: "Khach san", value: bookingData.value.hotelName },
      { label: "Dia chi", value: bookingData.value.hotelAddress },
      { label: "Loai phong", value: bookingData.value.orderDescription },
      { label: "Check-in", value: formatDate(bookingData.value.checkInDate) },
      { label: "Check-out", value: formatDate(bookingData.value.checkOutDate) },
      { label: "Phuong thuc", value: "Tien mat tai quay le tan" },
      { label: "Trang thai", value: "Da xac nhan" },
    ];

    details.forEach((item) => {
      y += 9;
      pdf.setTextColor(107, 114, 128);
      pdf.text(item.label + ":", margin, y);
      pdf.setTextColor(17, 24, 39);
      pdf.text(item.value, pageWidth - margin, y, { align: "right" });
    });

    y = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(9);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Ngay tao: ${new Date().toLocaleString("vi-VN")}`,
      pageWidth / 2,
      y,
      { align: "center" },
    );

    pdf.save(`dat-phong-${bookingData.value.reservationId}.pdf`);
  } catch (error) {
    console.error("Export PDF error:", error);
  } finally {
    isExporting.value = false;
  }
}
</script>
