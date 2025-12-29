<template>
  <Card class="group h-auto mb-6" style="overflow: hidden">
    <template #content>
      <div>
        <!-- Card Container -->
        <div class="flex gap-6 p-0">
          <!-- Left - Image Skeleton -->
          <div class="relative w-64 flex-shrink-0">
            <Skeleton width="100%" height="16rem" class="rounded-lg"></Skeleton>
          </div>

          <!-- Right - Content Skeleton -->
          <div class="flex-1 flex justify-between py-2">
            <!-- Middle - Hotel Info Skeleton -->
            <div class="flex-1">
              <!-- Title -->
              <Skeleton width="60%" height="2rem" class="mb-3"></Skeleton>

              <!-- Location Info -->
              <div class="flex items-center gap-2 mb-2">
                <Skeleton shape="circle" size="1rem"></Skeleton>
                <Skeleton width="15rem" height="0.875rem"></Skeleton>
              </div>

              <!-- Facilities -->
              <div class="flex items-center gap-2 mb-2">
                <Skeleton shape="circle" size="1rem"></Skeleton>
                <Skeleton width="20rem" height="0.875rem"></Skeleton>
              </div>

              <!-- Guest Info -->
              <div class="flex items-center gap-4 mb-4">
                <div class="flex items-center gap-2">
                  <Skeleton shape="circle" size="1rem"></Skeleton>
                  <Skeleton width="8rem" height="0.875rem"></Skeleton>
                </div>
                <div class="flex items-center gap-2">
                  <Skeleton shape="circle" size="1rem"></Skeleton>
                  <Skeleton width="5rem" height="0.875rem"></Skeleton>
                </div>
              </div>

              <!-- Experience -->
              <Skeleton width="12rem" height="0.875rem" class="mb-1"></Skeleton>
              <Skeleton width="10rem" height="1rem" class="mb-3"></Skeleton>

              <!-- Rating -->
              <div class="flex items-center gap-2">
                <Skeleton width="6rem" height="1rem"></Skeleton>
                <Skeleton width="8rem" height="0.875rem"></Skeleton>
              </div>
            </div>

            <!-- Right - Price Skeleton -->
            <div class="flex flex-col items-end justify-between pl-6">
              <div>
                <!-- Discount Badge -->
                <Skeleton
                  width="5rem"
                  height="1.75rem"
                  borderRadius="1rem"
                  class="mb-3"
                ></Skeleton>

                <!-- Price -->
                <Skeleton width="6rem" height="2.5rem" class="mb-2"></Skeleton>

                <!-- Tax Info -->
                <Skeleton
                  width="10rem"
                  height="0.75rem"
                  class="mb-3"
                ></Skeleton>

                <!-- Badges -->
                <div class="flex flex-col gap-2 mb-4 items-end">
                  <Skeleton width="12rem" height="0.875rem"></Skeleton>
                  <Skeleton width="10rem" height="0.875rem"></Skeleton>
                </div>
              </div>

              <!-- CTA Button -->
              <Skeleton
                width="10rem"
                height="2.5rem"
                borderRadius="0.375rem"
              ></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Skeleton from "primevue/skeleton";
</script>

<style scoped>
.card {
  max-width: 800px;
}
</style>
