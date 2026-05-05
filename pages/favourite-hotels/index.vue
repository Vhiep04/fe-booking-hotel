<template>
  <div class="min-h-screen pb-12 dark:bg-slate-900 mt-4">
    <div class="sticky top-0 z-10 dark:bg-slate-800">
      <div class="max-w-6xl mx-auto px-4 md:px-8">
        <div class="flex items-center justify-between mb-1">
          <p class="text-[#07689F] font-bold text-2xl mb-2">
            {{ t("My Favourite Hotels") }}
          </p>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          <template v-if="!store.isLoading">
            <span class="font-semibold text-blue-600 dark:text-blue-400">
              {{ store.totalCount }}
            </span>
            {{
              t(store.totalCount !== 1 ? "saved properties" : "saved property")
            }}
          </template>
          <Skeleton v-else width="80px" height="16px" class="inline-block" />
        </p>
      </div>
    </div>

    <div class="mx-auto max-w-6xl py-6 flex flex-col gap-5 px-4 md:px-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div class="col-span-2 sm:col-span-3 lg:col-span-1">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="filters.search"
              :placeholder="t('Search hotels…')"
              class="w-full text-sm!"
            />
          </IconField>
        </div>

        <Select
          v-model="filters.location"
          :options="locationOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('All Locations')"
          show-clear
          class="w-full text-sm!"
        />

        <Select
          v-model="filters.priceRange"
          :options="priceRanges"
          option-label="label"
          option-value="value"
          :placeholder="t('All Prices')"
          show-clear
          class="w-full text-sm!"
        />

        <Select
          v-model="filters.rating"
          :options="ratingOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('All Ratings')"
          show-clear
          class="w-full text-sm!"
        />

        <Select
          v-model="sortBy"
          :options="sortOptions"
          option-label="label"
          option-value="value"
          :placeholder="t('Sort by')"
          show-clear
          class="w-full text-sm!"
        />
      </div>

      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 -mt-1">
        <Chip
          v-if="filters.search"
          :label="`${t('Search')}: ${filters.search}`"
          removable
          class="text-xs!"
          @remove="filters.search = ''"
        />
        <Chip
          v-if="filters.location"
          :label="t(filters.location)"
          removable
          class="text-xs!"
          @remove="filters.location = null"
        />
        <Chip
          v-if="filters.priceRange"
          :label="
            priceRanges.find((p) => p.value === filters.priceRange)?.label ?? ''
          "
          removable
          class="text-xs!"
          @remove="filters.priceRange = null"
        />
        <Chip
          v-if="filters.rating"
          :label="`${filters.rating}+ ${t('Stars')}`"
          removable
          class="text-xs!"
          @remove="filters.rating = null"
        />
        <Button
          :label="t('Clear all')"
          text
          severity="secondary"
          size="small"
          class="text-xs! py-0!"
          @click="resetFilters"
        />
      </div>

      <div v-if="store.isLoading" class="flex flex-col gap-3">
        <div
          v-for="n in pageSize"
          :key="n"
          class="flex bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 h-[170px]"
        >
          <Skeleton
            width="190px"
            height="100%"
            class="shrink-0 rounded-none!"
          />
          <div class="flex flex-col gap-3 flex-1 p-4">
            <Skeleton width="65%" height="16px" />
            <Skeleton width="40%" height="12px" />
            <Skeleton width="30%" height="28px" class="mt-auto" />
          </div>
        </div>
      </div>

      <div
        v-else-if="filtered.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div
          class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4"
        >
          <i class="pi pi-heart text-4xl text-slate-300 dark:text-slate-500" />
        </div>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">
          {{
            store.favourites.length === 0
              ? t("No favourites yet")
              : t("No results found")
          }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-5">
          {{
            store.favourites.length === 0
              ? t("Save hotels you love and they'll appear here.")
              : t("Try adjusting your filters to find what you're looking for.")
          }}
        </p>
        <NuxtLink v-if="store.favourites.length === 0" to="/">
          <Button
            :label="t('Explore Hotels')"
            icon="pi pi-search"
            size="small"
          />
        </NuxtLink>
        <Button
          v-else
          :label="t('Clear Filters')"
          icon="pi pi-filter-slash"
          severity="secondary"
          size="small"
          outlined
          @click="resetFilters"
        />
      </div>

      <div v-else class="flex flex-col gap-3">
        <FavouriteHotelCard
          v-for="hotel in paginated"
          :key="hotel.favouriteId"
          :hotel="hotel"
          :is-favourited="store.isFavourited(hotel.hotelId)"
          @toggle-favourite="store.toggleFavourite($event)"
          @view="navigateToHotel"
        />
      </div>

      <div v-if="filtered.length > 0" class="mt-6">
        <Paginator
          v-model:rows="pageSize"
          :totalRecords="filtered.length"
          :first="firstRecord"
          :rowsPerPageOptions="[5, 10, 20]"
          @page="onPageChange"
          pt:root:class="bg-transparent!"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from "primevue/select";
import Chip from "primevue/chip";
import Skeleton from "primevue/skeleton";
import Paginator from "primevue/paginator";
import { useFavouriteHotelStore } from "~/stores/favouriteHotels";
import FavouriteHotelCard from "~/components/favourite-hotels/FavouriteHotelCard.vue";

const { t } = useI18n();
useHead({
  title: t("Favourite Hotels"),
});

const store = useFavouriteHotelStore();
const router = useRouter();

const filters = ref({
  search: "",
  location: null as string | null,
  priceRange: null as [number, number] | null,
  rating: null as number | null,
});
const sortBy = ref<string | null>(null);

// --- Pagination ---
const firstRecord = ref(0);
const pageSize = ref(5);

function onPageChange(event: { first: number; rows: number }) {
  firstRecord.value = event.first;
  pageSize.value = event.rows;
}

const paginated = computed(() =>
  filtered.value.slice(firstRecord.value, firstRecord.value + pageSize.value),
);
// ------------------

const locationOptions = computed(() =>
  [...new Set(store.favourites.map((h) => h.cityName))]
    .sort()
    .map((c) => ({ label: c, value: c })),
);

const priceRanges = computed(() => [
  { label: t("Under 1.000.000 VNĐ"), value: [0, 1000000] as [number, number] },
  {
    label: t("1.000.000 – 1.500.000 VNĐ"),
    value: [1000000, 1500000] as [number, number],
  },
  {
    label: t("1.500.000 – 2.000.000 VNĐ"),
    value: [1500000, 2000000] as [number, number],
  },
  { label: t("2.000.000+"), value: [2000000, 9999000] as [number, number] },
]);

const ratingOptions = computed(() => [
  { label: t("4.5+ Stars"), value: 4.5 },
  { label: t("4.0+ Stars"), value: 4.0 },
  { label: t("3.5+ Stars"), value: 3.5 },
  { label: t("3.0+ Stars"), value: 3.0 },
]);

const sortOptions = computed(() => [
  { label: t("Price: Low to High"), value: "price-asc" },
  { label: t("Price: High to Low"), value: "price-desc" },
  { label: t("Rating: High to Low"), value: "rating-desc" },
  { label: t("Name: A–Z"), value: "name-asc" },
]);

const filtered = computed(() => {
  let list = [...store.favourites];

  if (filters.value.search) {
    const q = filters.value.search.toLowerCase();
    list = list.filter(
      (h) =>
        h.hotelName.toLowerCase().includes(q) ||
        h.cityName.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q),
    );
  }
  if (filters.value.location) {
    list = list.filter((h) => h.cityName === filters.value.location);
  }
  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange;
    list = list.filter((h) => h.minPrice >= min && h.minPrice <= max);
  }
  if (filters.value.rating) {
    list = list.filter((h) => (h.averageRating ?? 0) >= filters.value.rating!);
  }

  switch (sortBy.value) {
    case "price-asc":
      list.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case "price-desc":
      list.sort((a, b) => b.minPrice - a.minPrice);
      break;
    case "rating-desc":
      list.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
      break;
    case "name-asc":
      list.sort((a, b) => a.hotelName.localeCompare(b.hotelName));
      break;
  }

  return list;
});

const hasActiveFilters = computed(
  () =>
    !!(
      filters.value.search ||
      filters.value.location ||
      filters.value.priceRange ||
      filters.value.rating
    ),
);

// Reset về trang đầu khi filter hoặc sort thay đổi
watch(
  [filters, sortBy],
  () => {
    firstRecord.value = 0;
  },
  { deep: true },
);

function resetFilters() {
  filters.value = {
    search: "",
    location: null,
    priceRange: null,
    rating: null,
  };
  sortBy.value = null;
}

function navigateToHotel(hotel: FavouriteHotel) {
  router.push(`/hotels/${hotel.hotelId}`);
}

onMounted(() => {
  store.fetchFavourites();
});
</script>
