<template>
  <footer class="bg-gray-100 py-10">
    <div class="mx-auto max-w-7xl px-4">
      <!-- Top Section -->
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-[#07689F] mb-3">
              {{ t("Go Further With The EasySet24 App") }}
            </h2>
            <p class="text-gray-700 mb-2">
              {{
                t(
                  "Enjoy Savings On Chosen Hotels And Flights When You Book Through The EasySet24 Website.",
                )
              }}
            </p>
            <p class="text-gray-700 mb-3">
              {{
                t(
                  "Additionally, Earn One Key Cash For Every Booking Made Through The App.",
                )
              }}
            </p>
            <p class="text-sm text-gray-500">
              {{ t("Secured By Europe GTP") }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
        <!-- About Us -->
        <div>
          <h3 class="font-bold text-gray-800 mb-4">{{ t("About Us") }}</h3>
          <ul class="space-y-2">
            <li v-for="link in aboutLinks" :key="link.key">
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ t(link.key) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- We Offer -->
        <div>
          <h3 class="font-bold text-gray-800 mb-4">{{ t("We Offer") }}</h3>
          <ul class="space-y-2">
            <li v-for="link in offerLinks" :key="link.key">
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ t(link.key) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Headquarters -->
        <div>
          <h3 class="font-bold text-gray-800 mb-4">{{ t("Headquarters") }}</h3>
          <ul class="space-y-2">
            <li v-for="link in hqLinks" :key="link.key">
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ t(link.key) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Travel Blogs -->
        <div>
          <h3 class="font-bold text-gray-800 mb-4">{{ t("Travel Blogs") }}</h3>
          <ul class="space-y-2">
            <li v-for="link in blogLinks" :key="link.key">
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ t(link.key) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Activities -->
        <div>
          <h3 class="font-bold text-gray-800 mb-4">{{ t("Activities") }}</h3>
          <ul class="space-y-2">
            <li v-for="link in activityLinks" :key="link.key">
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ t(link.key) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Service -->
        <div>
          <h3 class="font-bold text-gray-800 mb-4">{{ t("Service") }}</h3>
          <ul class="space-y-2">
            <li v-for="link in serviceLinks" :key="link.key">
              <a
                href="#"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {{ t(link.key) }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Payment Methods & Social Links -->
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-gray-300"
      >
        <!-- Payment Methods -->
        <div class="flex items-center gap-4 flex-wrap">
          <img
            src="../assets/icons/visa_card.png"
            alt="Visa"
            class="h-8 bg-white p-2 rounded border"
          />
          <img
            src="../assets/icons/visa_card.png"
            alt="American Express"
            class="h-8 bg-white p-2 rounded border"
          />
          <img
            src="../assets/icons/master_card.png"
            alt="Mastercard"
            class="h-8 bg-white p-2 rounded border"
          />
          <img
            src="../assets/icons/paypal.png"
            alt="PayPal"
            class="h-8 bg-white p-2 rounded border"
          />
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <a
            href="#"
            class="text-blue-700 hover:text-blue-800 text-2xl transition-colors"
          >
            <i class="pi pi-linkedin"></i>
          </a>
          <a
            href="#"
            class="text-blue-500 hover:text-blue-600 text-2xl transition-colors"
          >
            <i class="pi pi-send"></i>
          </a>
          <a
            href="#"
            class="text-blue-400 hover:text-blue-500 text-2xl transition-colors"
          >
            <i class="pi pi-twitter"></i>
          </a>
          <a
            href="#"
            class="text-blue-600 hover:text-blue-700 text-2xl transition-colors"
          >
            <i class="pi pi-facebook"></i>
          </a>
          <a
            href="#"
            class="text-pink-600 hover:text-pink-700 text-2xl transition-colors"
          >
            <i class="pi pi-instagram"></i>
          </a>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div
        class="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600"
      >
        <div class="flex items-center gap-2">
          <i class="pi pi-copyright" />
          <span>{{ t("Copyright EasySet24") }}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-envelope" />
          <span>EasySet24@Gmail.Com</span>
        </div>
        <div class="text-gray-700 font-medium">
          {{ t("EasySet24 Slogan") }}
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-map-marker" />
          <span>{{ t("EasySet24 Address") }}</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-phone" />
          <span>+44 20 7123 4567</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n();

const aboutLinks = [
  { key: "Our Story" },
  { key: "Work With Us" },
  { key: "Press & Media" },
  { key: "Privacy & Security" },
];

const offerLinks = [
  { key: "Trip Sponsorship" },
  { key: "Last Minutes Flights" },
  { key: "Best Deals" },
  { key: "AI-Driven Search" },
];

const hqLinks = [
  { key: "England" },
  { key: "France" },
  { key: "Canada" },
  { key: "Iceland" },
];

const blogLinks = [
  { key: "Bali Travel Guide" },
  { key: "Sri Travel Guide" },
  { key: "Peru Travel Guide" },
  { key: "Swiss Travel Guide" },
];

const activityLinks = [
  { key: "Tour Leading" },
  { key: "Cruising & Sailing" },
  { key: "Camping" },
  { key: "Kayaking" },
];

const serviceLinks = [
  { key: "Report Error" },
  { key: "Ask Online" },
  { key: "Travel Insurance" },
];
</script>
