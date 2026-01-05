<template>
  <div class="max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
    <!-- Image Gallery -->
    <div class="grid grid-cols-2 gap-2 mb-6">
      <div class="col-span-2 md:col-span-1">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
          alt="Building exterior"
          class="w-full h-64 md:h-full object-cover rounded-lg"
        />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
          alt="Bathroom"
          class="w-full h-32 md:h-48 object-cover rounded-lg"
        />
        <img
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"
          alt="Kitchen"
          class="w-full h-32 md:h-48 object-cover rounded-lg"
        />
        <img
          src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400"
          alt="Coffee"
          class="w-full h-32 md:h-48 object-cover rounded-lg"
        />
        <div class="relative w-full h-32 md:h-48 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400"
            alt="Bedroom"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Tabs Section -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <Tabs value="0">
        <TabList>
          <Tab
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="px-6 py-3 font-semibold text-gray-600 hover:text-blue-600 transition"
          >
            {{ tab.title }}
          </Tab>
        </TabList>
        <TabPanels>
          <!-- Place Details Tab -->
          <TabPanel value="0" class="p-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <p class="text-gray-700 leading-relaxed">
                  This Stylish And Roomy Family Home Is Nestled In Stockholm's
                  Kista District, Just 14 km Away From The Royal Swedish Opera
                  And Stockholm's Central Station, And Skavstao. Offering The
                  Convenience Of Free Private Parking. It's Also A Short 9 km
                  Drive From Friends Arena And 14 km From Sergels Torg Square.
                </p>

                <p class="text-gray-700 leading-relaxed">
                  Explore Nearby Attractions Like The Army Museum, Just 15 km
                  Away, And The Royal Palace, Situated 15 km From The Charming
                  Home. For Convenience, Bromma Stockholm Airport Is The Closest
                  Airport, Located Just 8 km Away From This Stylish And Spacious
                  Family Retreat.
                </p>
              </div>

              <div class="space-y-4">
                <p class="text-gray-700 leading-relaxed">
                  Your Stay At Our Hotel Includes A Complimentary Breakfast To
                  Kickstart Your Day, And Our Rooms Offer A Cosy And Comfortable
                  Retreat. Select Rooms Feature A Relaxing Bath Tub For Added
                  Luxury.
                </p>

                <p class="text-gray-700 leading-relaxed">
                  Our Dedicated Staff Is At Your Service, Ensuring A Seamless
                  And Enjoyable Experience Throughout Your Stay. In Addition To
                  The Inviting Accommodations, Guests Can Take Advantage Of
                  Amenities Such As Free Wifi. Our Team Has Thoughtfully Curated
                  Every Aspect To Make Your Stay Special Promising A Combination
                  Of Comfort, Convenience, And Delightful Strva.
                </p>
              </div>
            </div>
          </TabPanel>

          <!-- Place Rules Tab -->
          <TabPanel value="1" class="p-6">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold mb-3 text-gray-800">
                  Check-in/Check-out
                </h3>
                <div class="space-y-2 text-gray-700">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-clock text-blue-600"></i>
                    <span>Check-in: After 3:00 PM</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-clock text-blue-600"></i>
                    <span>Check-out: Before 11:00 AM</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-3 text-gray-800">
                  House Rules
                </h3>
                <ul class="space-y-2 text-gray-700">
                  <li class="flex items-start gap-2">
                    <i class="pi pi-ban text-red-500 mt-1"></i>
                    <span>No smoking in the property</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="pi pi-ban text-red-500 mt-1"></i>
                    <span>No parties or events allowed</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="pi pi-check text-green-600 mt-1"></i>
                    <span>Pets allowed with prior approval</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i class="pi pi-volume-off text-blue-600 mt-1"></i>
                    <span>Quiet hours: 10:00 PM - 8:00 AM</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-semibold mb-3 text-gray-800">
                  Cancellation Policy
                </h3>
                <p class="text-gray-700 leading-relaxed">
                  Free cancellation up to 48 hours before check-in. After that,
                  50% of the booking amount will be charged. No refund for
                  cancellations within 24 hours of check-in.
                </p>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <!-- Amenities & Booking Section -->
    <div class="grid md:grid-cols-3 gap-6">
      <!-- Amenities Section -->
      <div class="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-bold mb-6">Amenities</h2>

        <div class="grid sm:grid-cols-2 gap-4">
          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-wifi text-lg"></i>
            <span>Free Wifi</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-car text-lg"></i>
            <span>Parking Available</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-building text-lg"></i>
            <span>Restaurant</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-heart text-lg"></i>
            <span>Fitness Center</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-home text-lg"></i>
            <span>Bathroom</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-tablet text-lg"></i>
            <span>Room Service</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-sun text-lg"></i>
            <span>Air Conditioning</span>
          </div>

          <div class="flex items-center gap-3 text-gray-700">
            <i class="pi pi-ticket text-lg"></i>
            <span>Tea/Coffee Machine</span>
          </div>
        </div>
      </div>

      <!-- Booking Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="space-y-4 mb-6">
          <div class="text-sm text-gray-600">
            <div class="font-semibold text-gray-800 mb-1">
              2 Adults, 3 Children, 4 Nights
            </div>
            <div>Two Rooms, Double Bed</div>
          </div>

          <div class="flex items-start gap-2 text-sm text-gray-600">
            <i class="pi pi-map-marker text-blue-600 mt-1"></i>
            <span>Lorikvägen 25, Stockholm, Sweden</span>
          </div>

          <div class="border-t pt-4">
            <div class="flex items-end justify-between mb-4">
              <div>
                <div class="text-3xl font-bold text-green-600">$240</div>
                <div class="text-sm text-gray-600">Per night</div>
              </div>
            </div>

            <div class="flex gap-2">
              <Button @click="like = !like">
                <i
                  :class="[
                    ' p-1  transition-all duration-100 ',
                    like
                      ? 'text-red-500 pi pi-heart-fill'
                      : 'text-white pi pi-heart',
                  ]"
                />
              </Button>
              <Button
                label="Book Now"
                class="flex-1 bg-blue-600 hover:bg-blue-700 border-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button, Tabs, TabList, Tab, TabPanels, TabPanel } from "primevue";
import BreadCrumb from "./shared/layout/BreadCrumb.vue";
import SearchForm from "./SearchForm.vue";

const like = ref(false);

const breadcrumbList = computed(() => {
  return [
    {
      title: "Home",
      path: "/",
    },
  ];
});

const tabs = ref([
  { title: "Place Details", value: "0" },
  { title: "Place Rules", value: "1" },
]);
</script>

<style scoped>
/* Custom tab styling */
:deep(.p-tablist) {
  background: transparent;
}

:deep(.p-tab) {
  border-bottom: 2px solid transparent;
}

:deep(.p-tab.p-tab-active) {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

:deep(.p-button) {
  font-weight: 600;
}

:deep(.p-button-outlined) {
  background: transparent;
}
</style>
