<template>
  <section class="feedback-section py-10">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="section-title text-2xl font-bold text-gray-900 mb-1">
            {{ t("What our customers say about us") }}
          </h2>
          <p class="text-gray-500 text-sm">
            {{
              t("{n} reviews from real guests", { n: hotel?.totalReviews ?? 0 })
            }}
          </p>
        </div>

        <!-- Rating Summary -->
        <div
          class="rating-summary hidden md:flex items-center gap-4 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100"
        >
          <div class="text-center">
            <div class="text-4xl font-extrabold text-amber-500 leading-none">
              {{ hotel?.averageRating ?? "—" }}
            </div>
            <div class="flex gap-0.5 mt-1 justify-center">
              <i
                v-for="star in 5"
                :key="star"
                class="pi text-xs"
                :class="getStarClass(star, Number(hotel?.averageRating ?? 0))"
              />
            </div>
            <div class="text-xs text-gray-400 mt-0.5">
              {{ t("Average score") }}
            </div>
          </div>
          <div class="w-px h-12 bg-gray-200" />
          <div class="space-y-1 min-w-[140px]">
            <div
              v-for="(count, label) in ratingBars"
              :key="label"
              class="flex items-center gap-2 text-xs text-gray-500"
            >
              <span class="w-6 text-right shrink-0">{{ label }}★</span>
              <div
                class="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden"
              >
                <div
                  class="h-full rounded-full bg-amber-400 transition-all duration-700"
                  :style="{ width: getBarWidth(count) + '%' }"
                />
              </div>
              <span class="w-4 shrink-0">{{ count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel -->
      <div class="relative">
        <!-- Nav Buttons -->
        <button
          class="carousel-btn carousel-btn--left"
          :class="{ 'opacity-30 cursor-not-allowed': currentIndex === 0 }"
          :disabled="currentIndex === 0"
          @click="prev"
          :aria-label="t('Previous')"
        >
          <i class="pi pi-chevron-left text-sm" />
        </button>

        <button
          class="carousel-btn carousel-btn--right"
          :class="{ 'opacity-30 cursor-not-allowed': currentIndex >= maxIndex }"
          :disabled="currentIndex >= maxIndex"
          @click="next"
          :aria-label="t('Next')"
        >
          <i class="pi pi-chevron-right text-sm" />
        </button>

        <!-- Cards Wrapper -->
        <div class="overflow-hidden mx-10">
          <div
            class="flex gap-5 transition-transform duration-500 ease-in-out"
            :style="{
              transform: `translateX(calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (20 / visibleCards)}px))`,
            }"
          >
            <div
              v-for="fb in feedbacks"
              :key="fb.feedbackId"
              class="feedback-card shrink-0 flex flex-col"
              :style="{
                width: `calc(${100 / visibleCards}% - ${(20 * (visibleCards - 1)) / visibleCards}px)`,
              }"
            >
              <!-- Card Header -->
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="avatar"
                  :style="{ background: getAvatarColor(fb.userName) }"
                >
                  {{ fb.userName.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-gray-900 text-sm truncate">
                    {{ fb.userName }}
                  </div>
                  <div class="flex gap-0.5 mt-0.5">
                    <i
                      v-for="star in 5"
                      :key="star"
                      class="pi text-[11px]"
                      :class="getStarClass(star, fb.rating)"
                    />
                  </div>
                </div>
                <div class="text-xs text-gray-400 shrink-0">
                  {{ formatDate(fb.createdAt) }}
                </div>
              </div>

              <!-- Quote Icon -->
              <div
                class="text-amber-300 text-4xl leading-none font-serif mb-1 select-none"
              >
                "
              </div>

              <!-- Comment -->
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-4">
                {{ fb.comment }}
              </p>

              <!-- Bottom Tag -->
              <div
                class="mt-auto pt-3 border-t border-gray-100 flex items-center gap-2"
              >
                <span
                  class="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium"
                >
                  <i class="pi pi-verified text-[10px]" />
                  {{ t("Verified") }}
                </span>
                <span class="ml-auto text-xs text-amber-500 font-semibold">
                  {{ fb.rating }}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots -->
        <div class="flex justify-center gap-1.5 mt-6">
          <button
            v-for="i in dotCount"
            :key="i"
            class="dot transition-all duration-300"
            :class="currentIndex === i - 1 ? 'dot--active' : ''"
            @click="currentIndex = i - 1"
          />
        </div>
      </div>

      <div
        v-if="feedbacks.length === 0"
        class="text-center py-16 text-gray-400"
      >
        <i class="pi pi-comment text-4xl mb-3 block" />
        <p class="text-sm">{{ t("No reviews yet") }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import type { HotelData, Feedback } from "~/stores/interface/response/cityList";

const props = defineProps<{
  hotel: HotelData | null;
}>();

const { t, locale } = useI18n();

const currentIndex = ref(0);
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1280,
);

const visibleCards = computed(() => {
  if (windowWidth.value < 640) return 1;
  if (windowWidth.value < 1024) return 2;
  return 3;
});

const feedbacks = computed<Feedback[]>(
  () => props.hotel?.recentFeedbacks ?? [],
);

const maxIndex = computed(() =>
  Math.max(0, feedbacks.value.length - visibleCards.value),
);

const dotCount = computed(() => maxIndex.value + 1);

const ratingBars = computed(() => {
  const dist = props.hotel?.ratingDistribution;
  if (!dist) return {};
  return {
    5: dist.fiveStar,
    4: dist.fourStar,
    3: dist.threeStar,
    2: dist.twoStar,
    1: dist.oneStar,
  };
});

const totalRatings = computed(() =>
  Object.values(ratingBars.value).reduce((a, b) => a + b, 0),
);

function getBarWidth(count: number | undefined) {
  if (!totalRatings.value || !count) return 0;
  return Math.round((count / totalRatings.value) * 100);
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--;
}

function next() {
  if (currentIndex.value < maxIndex.value) currentIndex.value++;
}

function getStarClass(star: number, rating: number) {
  if (star <= Math.floor(rating)) return "pi-star-fill text-amber-400";
  if (star - rating < 1 && star - rating > 0)
    return "pi-star-fill text-amber-300";
  return "pi-star text-gray-300";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale.value, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const avatarColors = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function handleResize() {
  windowWidth.value = window.innerWidth;
  currentIndex.value = Math.min(currentIndex.value, maxIndex.value);
}

onMounted(() => window.addEventListener("resize", handleResize));
onBeforeUnmount(() => window.removeEventListener("resize", handleResize));
</script>

<style scoped>
.feedback-section {
  background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
}

.section-title {
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 2px;
}

.feedback-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 1px 4px rgba(0, 0, 0, 0.05),
    0 4px 16px rgba(0, 0, 0, 0.04);
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.feedback-card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition:
    background 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
  cursor: pointer;
}

.carousel-btn:hover:not(:disabled) {
  background: #f59e0b;
  color: #fff;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
  transform: translateY(-50%) scale(1.08);
}

.carousel-btn--left {
  left: 0;
}
.carousel-btn--right {
  right: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #d1d5db;
  border: none;
  cursor: pointer;
  padding: 0;
}

.dot--active {
  background: #f59e0b;
  width: 24px;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
