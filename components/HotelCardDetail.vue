<template>
  <Card
    class="group h-auto hover:cursor-pointer hover:shadow-xl transition-shadow duration-300"
    style="overflow: hidden"
    v-if="isLoading"
  >
    <template #content>
      <div>
        <!-- Card Container -->
        <div class="flex flex-col sm:flex-row">
          <!-- Image Section - Left Side -->
          <div class="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
            <Skeleton
              width="100%"
              height="100%"
              class="rounded-none"
            ></Skeleton>
          </div>

          <!-- Content Section - Right Side -->
          <div class="flex-1 p-4 sm:p-5">
            <div class="flex justify-between items-start mb-3">
              <!-- Hotel Name -->
              <div class="flex-1">
                <Skeleton width="10rem" height="1.5rem" class="mb-2"></Skeleton>

                <!-- Location Info -->
                <div class="flex items-center gap-2 mb-2">
                  <Skeleton shape="circle" size="1rem"></Skeleton>
                  <Skeleton width="15rem" height="0.875rem"></Skeleton>
                </div>

                <!-- Amenities -->
                <div class="flex items-center gap-2 mb-2">
                  <Skeleton shape="circle" size="1rem"></Skeleton>
                  <Skeleton width="8rem" height="0.875rem"></Skeleton>
                </div>

                <!-- Guest Info -->
                <div class="flex items-center gap-2 mb-3">
                  <Skeleton shape="circle" size="1rem"></Skeleton>
                  <Skeleton width="12rem" height="0.875rem"></Skeleton>
                </div>
              </div>

              <!-- Price Section -->
              <div class="mt-14">
                <div class="flex gap-6 mb-1">
                  <Skeleton
                    width="4rem"
                    height="2rem"
                    class="mb-1 ml-auto"
                  ></Skeleton>
                  <Skeleton
                    width="4rem"
                    height="2rem"
                    class="mb-1 ml-auto"
                  ></Skeleton>
                </div>
                <Skeleton
                  width="10rem"
                  height="0.75rem"
                  class="mb-1"
                ></Skeleton>
              </div>
            </div>

            <!-- Tags Section -->
            <div class="mb-3">
              <Skeleton width="12rem" height="0.875rem" class="mb-2"></Skeleton>
              <Skeleton width="8rem" height="0.875rem"></Skeleton>
            </div>

            <!-- Rating and Availability Section -->
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Skeleton width="5rem" height="1.25rem"></Skeleton>
                <Skeleton width="6rem" height="0.875rem"></Skeleton>
              </div>

              <div class="flex items-center gap-2">
                <Skeleton width="8rem" height="1.5rem"></Skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>

  <Card
    v-else
    class="group h-auto hover:cursor-pointer hover:shadow-xl transition-shadow duration-300"
    style="overflow: hidden"
  >
    <template #content>
      <div class="flex gap-6 p-0">
        <!-- Left - Image Section -->
        <div class="relative w-64 flex-shrink-0">
          <img
            alt="Radisson Blu Hotel"
            src="../assets/images/detail_hotel_1.jpg"
            class="w-full h-full object-cover rounded-lg"
          />

          <!-- Heart Icon -->
          <button
            class="absolute top-3 left-3 rounded-full"
            @click="like = !like"
          >
            <i
              :class="[
                'bg-white rounded-3xl p-1 hover:text-red-500 transition-all duration-300 ',
                like
                  ? 'text-red-500 pi pi-heart-fill'
                  : 'text-black pi pi-heart',
              ]"
            />
          </button>

          <!-- Image Indicators -->
          <div class="absolute bottom-3 left-3 flex gap-1">
            <span class="w-2 h-2 bg-white rounded-full opacity-100"></span>
            <span class="w-2 h-2 bg-white rounded-full opacity-50"></span>
            <span class="w-2 h-2 bg-white rounded-full opacity-50"></span>
            <span class="w-2 h-2 bg-white rounded-full opacity-50"></span>
          </div>

          <!-- Rating Badge -->
          <div
            class="absolute bottom-3 right-3 bg-gray-800 text-white px-2 py-1 rounded text-sm font-semibold"
          >
            8.2
          </div>
        </div>

        <!-- Right - Content Section -->
        <div class="flex-1 flex justify-between py-2">
          <!-- Middle - Hotel Info -->
          <div class="flex-1">
            <!-- Title -->
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Radisson Blu</h2>

            <!-- Location -->
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <i class="pi pi-map-marker text-sm"></i>
              <span class="text-sm"
                >Located In Downton, 500m Distance to Shore</span
              >
            </div>

            <!-- Breakfast -->
            <div class="flex items-center gap-2 text-gray-600 mb-2">
              <i class="pi pi-shopping-bag text-sm"></i>
              <span class="text-sm">Breakfast Included</span>
            </div>

            <!-- Guest Info -->
            <div class="flex items-center gap-4 text-gray-600 mb-4">
              <div class="flex items-center gap-2">
                <i class="pi pi-user text-sm"></i>

                <span class="text-sm">1 Adult, 2 Children</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="pi pi-clock text-sm"></i>
                <span class="text-sm">4 Nights</span>
              </div>
            </div>

            <!-- Experience -->
            <p class="text-gray-400 text-sm mb-1">
              Experience Unique Opportunity
            </p>
            <p class="text-gray-700 font-medium mb-3">Standard rooms</p>

            <!-- Rating -->
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-900">Very Good</span>
              <span class="text-gray-500 text-sm">2,259 Reviews</span>
              <i class="pi pi-chevron-down text-sm text-gray-500"></i>
            </div>
          </div>

          <!-- Right - Price Section -->
          <div class="flex flex-col items-end justify-between pl-6">
            <div>
              <!-- Discount Badge -->
              <span
                class="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block"
              >
                12% Off
              </span>

              <!-- Price -->
              <div class="text-right mb-2">
                <span class="text-4xl font-bold text-green-600">$125</span>
              </div>

              <!-- Tax Info -->
              <p class="text-xs text-gray-500 mb-3 text-right">
                Includes taxes and charges
              </p>

              <!-- Badges -->
              <div class="flex flex-col gap-1 mb-4 items-end">
                <div class="flex items-center gap-1 text-xs">
                  <i class="pi pi-check-circle text-green-600"></i>
                  <span class="text-gray-600">Trip Sustainable Level, 5</span>
                </div>
                <div class="flex items-center gap-1 text-xs">
                  <i class="pi pi-info-circle text-red-500"></i>
                  <span class="text-red-600">We Have 8 Left at 12% off</span>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <Button
              label="See Availability"
              icon="pi pi-chevron-right"
              iconPos="right"
              class="bg-white text-blue-600 border-none hover:bg-blue-50 font-semibold shadow-none"
              text
            />
          </div>
        </div>
      </div>
    </template>
  </Card>
  <!-- <button @click="isLoading = !isLoading">Render</button> -->
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import { ref } from "vue";
import Skeleton from "primevue/skeleton";

const like = ref(false);

const isLoading = ref(false);
</script>

<style scoped>
/* Custom styles if needed */
.card {
  max-width: 800px;
}
</style>
