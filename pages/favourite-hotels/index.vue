<template>
  <div
    class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800"
  >
    <!-- Header -->
    <div
      class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
            My Favourite Hotels
          </h1>
          <NuxtLink
            to="/"
            class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            ← Back to Home
          </NuxtLink>
        </div>
        <p class="text-slate-600 dark:text-slate-400">
          You have
          <span class="font-semibold">{{ totalFavourites }}</span> favourite
          hotel{{ totalFavourites !== 1 ? "s" : "" }}
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <!-- Filter & Sort Section -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <!-- Search -->
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters.search"
            placeholder="Search hotels..."
            class="w-full"
          />
        </IconField>

        <!-- Location Filter -->
        <Dropdown
          v-model="filters.location"
          :options="locationOptions"
          option-label="label"
          option-value="value"
          placeholder="All Locations"
          @change="filterHotels"
        />

        <!-- Price Range Filter -->
        <Dropdown
          v-model="filters.priceRange"
          :options="priceRanges"
          option-label="label"
          option-value="value"
          placeholder="All Prices"
          @change="filterHotels"
        />

        <!-- Rating Filter -->
        <Dropdown
          v-model="filters.rating"
          :options="ratingOptions"
          option-label="label"
          option-value="value"
          placeholder="All Ratings"
          @change="filterHotels"
        />

        <!-- Sort -->
        <Dropdown
          v-model="sortBy"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          placeholder="Sort by"
          @change="sortHotels"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredHotels.length === 0" class="py-16">
        <div class="text-center">
          <div
            class="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <i
              class="pi pi-heart-fill text-4xl text-slate-400 dark:text-slate-500"
            ></i>
          </div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No Favourite Hotels Yet
          </h3>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            Start adding hotels to your favourites to see them here
          </p>
          <NuxtLink
            to="/hotels"
            class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Explore Hotels
          </NuxtLink>
        </div>
      </div>

      <!-- Hotels Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="hotel in filteredHotels"
          :key="hotel.id"
          class="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Hotel Image -->
          <div
            class="relative h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden"
          >
            <img
              :src="
                hotel.image ||
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'
              "
              :alt="hotel.name"
              class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
            <!-- Rating Badge -->
            <div
              class="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
            >
              <i class="pi pi-star-fill text-xs"></i>
              {{ hotel.rating || "4.5" }}
            </div>
            <!-- Favourite Button -->
            <button
              @click="toggleFavourite(hotel.id)"
              class="absolute top-3 left-3 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition"
            >
              <i
                :class="[
                  'pi text-lg',
                  isFavourite(hotel.id)
                    ? 'pi-heart-fill text-red-500'
                    : 'pi-heart text-slate-400',
                ]"
              ></i>
            </button>
          </div>

          <!-- Hotel Info -->
          <div class="p-4">
            <!-- Name -->
            <h3
              class="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-2"
            >
              {{ hotel.name }}
            </h3>

            <!-- Location -->
            <div
              class="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-sm mb-3"
            >
              <i class="pi pi-map-marker text-xs"></i>
              {{ hotel.location || "Unknown Location" }}
            </div>

            <!-- Description -->
            <p
              class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2"
            >
              {{
                hotel.description || "Beautiful hotel with excellent amenities"
              }}
            </p>

            <!-- Amenities -->
            <div class="flex gap-2 mb-4 flex-wrap">
              <span
                v-for="(amenity, idx) in hotel.amenities?.slice(0, 2)"
                :key="idx"
                class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
              >
                {{ amenity }}
              </span>
              <span
                v-if="hotel.amenities?.length > 2"
                class="px-2 py-1 text-xs text-slate-600 dark:text-slate-400"
              >
                +{{ hotel.amenities.length - 2 }} more
              </span>
            </div>

            <!-- Price & Action -->
            <div
              class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">
                  ${{ hotel.price || "99" }}
                </p>
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  per night
                </p>
              </div>
              <NuxtLink
                :to="`/hotels/${hotel.id}`"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredHotels.length > 0"
        class="flex items-center justify-center gap-4 mt-12"
      >
        <Button
          icon="pi pi-chevron-left"
          severity="secondary"
          text
          :disabled="currentPage === 1"
          @click="currentPage--"
        />
        <div class="flex gap-2">
          <Button
            v-for="page in totalPages"
            :key="page"
            :label="String(page)"
            :severity="currentPage === page ? 'primary' : 'secondary'"
            text
            @click="currentPage = page"
          />
        </div>
        <Button
          icon="pi pi-chevron-right"
          severity="secondary"
          text
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

// Sample Data - Replace with API call
const favouriteHotels = ref([
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York",
    price: 189,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    description: "Luxury hotel in the heart of Manhattan",
    amenities: ["Free WiFi", "Gym", "Pool", "Restaurant"],
  },
  {
    id: 2,
    name: "Sunset Beach Resort",
    location: "Miami",
    price: 159,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop",
    description: "Beautiful beachfront resort with stunning ocean views",
    amenities: ["Beach Access", "Spa", "Bar", "Parking"],
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Denver",
    price: 129,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1551524164-0fcaf6c6daea?w=400&h=300&fit=crop",
    description: "Cozy lodge with panoramic mountain views",
    amenities: ["Hiking Trails", "Fireplace", "Restaurant", "WiFi"],
  },
  {
    id: 4,
    name: "Modern City Center",
    location: "Los Angeles",
    price: 179,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1597696058674-c9f498c0f20d?w=400&h=300&fit=crop",
    description: "Contemporary hotel in LA downtown",
    amenities: ["Rooftop Bar", "Gym", "Concierge", "Parking"],
  },
  {
    id: 5,
    name: "Historic Boston Inn",
    location: "Boston",
    price: 149,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1518929458119-e5bf27a6d881?w=400&h=300&fit=crop",
    description: "Classic hotel with historical charm",
    amenities: ["Bar", "Restaurant", "Meeting Rooms", "WiFi"],
  },
  {
    id: 6,
    name: "Tropical Paradise Hotel",
    location: "Hawaii",
    price: 249,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
    description: "Ultimate tropical vacation destination",
    amenities: ["Beach Club", "Water Sports", "Spa", "Restaurant"],
  },
]);

// Filters
const filters = ref({
  search: "",
  location: null,
  priceRange: null,
  rating: null,
});

const sortBy = ref(null);
const currentPage = ref(1);
const itemsPerPage = 9;

// Filter Options
const locationOptions = ref([
  { label: "New York", value: "New York" },
  { label: "Miami", value: "Miami" },
  { label: "Denver", value: "Denver" },
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "Boston", value: "Boston" },
  { label: "Hawaii", value: "Hawaii" },
]);

const priceRanges = ref([
  { label: "Under $100", value: [0, 100] },
  { label: "$100 - $150", value: [100, 150] },
  { label: "$150 - $200", value: [150, 200] },
  { label: "$200+", value: [200, 999] },
]);

const ratingOptions = ref([
  { label: "4.5+ Stars", value: 4.5 },
  { label: "4.0+ Stars", value: 4.0 },
  { label: "3.5+ Stars", value: 3.5 },
  { label: "3.0+ Stars", value: 3.0 },
]);

const sortOptions = ref([
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Rating: Low to High", value: "rating-asc" },
  { label: "Name: A to Z", value: "name-asc" },
]);

// Computed
const filteredHotels = computed(() => {
  let result = [...favouriteHotels.value];

  // Apply text search
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (h) =>
        h.name.toLowerCase().includes(search) ||
        h.location.toLowerCase().includes(search) ||
        h.description.toLowerCase().includes(search),
    );
  }

  // Apply location filter
  if (filters.value.location) {
    result = result.filter((h) => h.location === filters.value.location);
  }

  // Apply price range filter
  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange;
    result = result.filter((h) => h.price >= min && h.price <= max);
  }

  // Apply rating filter
  if (filters.value.rating) {
    result = result.filter((h) => h.rating >= filters.value.rating);
  }

  // Apply sorting
  if (sortBy.value) {
    switch (sortBy.value) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }

  return result;
});

const paginatedHotels = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredHotels.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredHotels.value.length / itemsPerPage);
});

const totalFavourites = computed(() => favouriteHotels.value.length);

// Methods
const filterHotels = () => {
  currentPage.value = 1;
};

const sortHotels = () => {
  currentPage.value = 1;
};

const toggleFavourite = (hotelId: number) => {
  // API call to toggle favourite
  console.log("[v0] Toggle favourite hotel:", hotelId);
  // const response = await $fetch(`/api/hotels/${hotelId}/favourite`, { method: 'POST' })
};

const isFavourite = (hotelId: number) => {
  return favouriteHotels.value.some((h) => h.id === hotelId);
};
</script>

<style scoped>
/* :deep(.p-inputtext),
:deep(.p-dropdown) {
  @apply dark:bg-slate-700 dark:text-white dark:border-slate-600;
}

:deep(.p-button-text) {
  @apply dark:text-slate-400 dark:hover:text-slate-200;
} */
</style>
