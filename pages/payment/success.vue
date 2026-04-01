<template>
  <div
    class="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4 sm:p-6"
  >
    <div ref="receiptRef" class="w-full max-w-md sm:max-w-lg">
      <Card class="shadow-lg">
        <template #header>
          <div
            class="flex flex-col items-center pt-6 sm:pt-8 pb-3 sm:pb-4 bg-linear-to-b from-green-50 to-transparent dark:from-green-950/20 px-4"
          >
            <div
              class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3 sm:mb-4 ring-4 ring-green-200 dark:ring-green-800/50"
            >
              <i
                class="pi pi-check text-3xl sm:text-4xl text-green-600 dark:text-green-400"
              ></i>
            </div>
            <Tag severity="success" class="mb-2 text-xs sm:text-sm">
              <i class="pi pi-verified mr-1"></i>
              Giao dich thanh cong
            </Tag>
            <h1
              class="text-xl sm:text-2xl font-bold text-surface-900 dark:text-surface-0 text-center"
            >
              Thanh toan hoan tat
            </h1>
          </div>
        </template>

        <template #content>
          <div
            class="text-center py-4 sm:py-6 mb-4 sm:mb-6 bg-surface-100 dark:bg-surface-800 rounded-xl"
          >
            <span
              class="text-xs sm:text-sm text-surface-500 dark:text-surface-400 uppercase tracking-wider block mb-1"
              >So tien da thanh toan</span
            >
            <span
              class="text-2xl sm:text-4xl font-bold text-surface-900 dark:text-surface-0"
              >{{ formattedAmount }}</span
            >
            <span
              class="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400 ml-1 sm:ml-2"
              >VND</span
            >
          </div>

          <div
            class="space-y-0 divide-y divide-surface-200 dark:divide-surface-700 border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden text-sm"
          >
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Mo ta don hang</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-surface-700 dark:text-surface-200 sm:text-right sm:max-w-[200px] truncate"
                >{{ paymentData.orderDescription }}</span
              >
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Ma giao dich</span
              >
              <span
                class="text-xs sm:text-sm font-mono font-medium text-green-600 dark:text-green-400"
                >{{ paymentData.transactionId }}</span
              >
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Ma don hang</span
              >
              <span
                class="text-xs sm:text-sm font-mono text-surface-600 dark:text-surface-300"
                >{{ paymentData.orderId }}</span
              >
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Phuong thuc thanh toan</span
              >
              <Tag
                :value="paymentData.paymentMethod"
                severity="info"
                class="w-fit"
              />
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-0 dark:bg-surface-900"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Ma thanh toan</span
              >
              <span
                class="text-xs sm:text-sm font-mono font-medium text-green-600 dark:text-green-400"
                >{{ paymentData.paymentId }}</span
              >
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-3 sm:p-4 bg-surface-50 dark:bg-surface-800"
            >
              <span
                class="text-xs sm:text-sm text-surface-500 dark:text-surface-400"
                >Trang thai</span
              >
              <Tag severity="success" class="w-fit">
                <i class="pi pi-check-circle mr-1"></i>
                Thanh cong
              </Tag>
            </div>
          </div>

          <Panel
            header="Ma xac thuc"
            toggleable
            :collapsed="!showToken"
            @update:collapsed="showToken = !$event"
            class="mt-4"
          >
            <div class="flex flex-col gap-3">
              <code
                class="text-[10px] sm:text-xs text-surface-500 dark:text-surface-400 break-all bg-surface-100 dark:bg-surface-800 p-2 sm:p-3 rounded-lg block"
              >
                {{ paymentData.token }}
              </code>
              <Button
                :label="tokenCopied ? 'Da sao chep!' : 'Sao chep'"
                :icon="tokenCopied ? 'pi pi-check' : 'pi pi-copy'"
                :severity="tokenCopied ? 'success' : 'secondary'"
                size="small"
                outlined
                @click="copyToken"
                class="self-end"
              />
            </div>
          </Panel>
        </template>

        <template #footer>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                label="Ve trang chu"
                icon="pi pi-home"
                @click="goHome"
                class="flex-1"
                size="small"
              />
              <Button
                label="Xuat PDF"
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
              Bien lai giao dich da duoc gui den email cua ban
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
import Panel from "primevue/panel";
import jsPDF from "jspdf";

useHead({
  title: "Thanh toan thanh cong",
});

definePageMeta({
  layout: false,
});

const router = useRouter();

const showToken = ref(false);
const tokenCopied = ref(false);
const isExporting = ref(false);
const receiptRef = ref<HTMLElement | null>(null);

const paymentData = computed(() => {
  if (import.meta.client) {
    const stored = sessionStorage.getItem("paymentResponse");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        orderDescription: parsed.orderDescription ?? "",
        transactionId: parsed.transactionId ?? "",
        orderId: parsed.orderId ?? "",
        paymentMethod: parsed.paymentMethod ?? "VnPay",
        paymentId: parsed.transactionId ?? "",
        token: parsed.token ?? "",
        amount: parsed.amount ?? 0,
        success: parsed.success ?? true,
        emailSent: parsed.emailSent ?? false,
        message: parsed.message ?? "",
      };
    }
  }

  // Fallback demo
  return {
    orderDescription: "Demo Room Booking",
    transactionId: "15476426",
    orderId: "63910569713879585",
    paymentMethod: "VnPay",
    paymentId: "15476426",
    token:
      "30ea3e5fcb83fb90b54aedf6f42bf6d94b38711c4720ec181e07fe025744f4f65904ff5b01f003c0c36576a3659e7eac44907fb05af3ddf2f74be075b0d3a725",
    amount: 1000000,
    success: true,
    emailSent: false,
    message: "",
  };
});

const formattedAmount = computed(() =>
  new Intl.NumberFormat("vi-VN").format(paymentData.value.amount),
);

onMounted(() => {
  sessionStorage.removeItem("paymentResponse");

  history.replaceState(null, "", "/payment/success");

  window.addEventListener("popstate", handlePopState);
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});

function handlePopState() {
  router.replace("/");
}

async function copyToken() {
  try {
    await navigator.clipboard.writeText(paymentData.value.token);
    tokenCopied.value = true;
    setTimeout(() => (tokenCopied.value = false), 2000);
  } catch {}
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

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(34, 197, 94); // green-500
    pdf.text("THANH TOAN THANH CONG", pageWidth / 2, y, { align: "center" });

    y += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray-500
    pdf.text("Bien lai giao dich", pageWidth / 2, y, { align: "center" });

    // Divider
    y += 10;
    pdf.setDrawColor(229, 231, 235); // gray-200
    pdf.line(margin, y, pageWidth - margin, y);

    // Amount
    y += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(107, 114, 128);
    pdf.text("So tien da thanh toan:", margin, y);

    y += 10;
    pdf.setFontSize(28);
    pdf.setTextColor(17, 24, 39); // gray-900
    pdf.text(`${formattedAmount.value} VND`, margin, y);

    // Divider
    y += 10;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, y, pageWidth - margin, y);

    // Details
    y += 10;
    pdf.setFontSize(11);

    const details = [
      { label: "Mo ta don hang", value: paymentData.value.orderDescription },
      { label: "Ma giao dich", value: paymentData.value.transactionId },
      { label: "Ma don hang", value: paymentData.value.orderId },
      {
        label: "Phuong thuc thanh toan",
        value: paymentData.value.paymentMethod,
      },
      { label: "Ma thanh toan", value: paymentData.value.paymentId },
      { label: "Trang thai", value: "Thanh cong" },
    ];

    details.forEach((item) => {
      y += 8;
      pdf.setTextColor(107, 114, 128);
      pdf.text(item.label + ":", margin, y);

      pdf.setTextColor(17, 24, 39);
      const valueWidth =
        pageWidth - margin - pdf.getTextWidth(item.label + ":  ") - margin;
      const value =
        item.value.length > 40
          ? item.value.substring(0, 40) + "..."
          : item.value;
      pdf.text(value, pageWidth - margin, y, { align: "right" });
    });

    // Token
    y += 15;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.setTextColor(107, 114, 128);
    pdf.text("Ma xac thuc:", margin, y);

    y += 6;
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99); // gray-600
    const tokenLines = pdf.splitTextToSize(
      paymentData.value.token,
      pageWidth - margin * 2,
    );
    pdf.text(tokenLines, margin, y);

    // Footer
    y = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(9);
    pdf.setTextColor(156, 163, 175); // gray-400
    pdf.text(
      `Ngay tao: ${new Date().toLocaleString("vi-VN")}`,
      pageWidth / 2,
      y,
      { align: "center" },
    );

    // Save
    pdf.save(`bien-lai-${paymentData.value.orderId}.pdf`);
  } catch (error) {
    console.error("Export PDF error:", error);
  } finally {
    isExporting.value = false;
  }
}
</script>
