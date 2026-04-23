<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 animate-pulse"
  >
    <div class="flex gap-4">
      <!-- Avatar skeleton -->
      <div class="w-12 h-12 rounded-full bg-gray-200 shrink-0" />

      <!-- Content skeleton -->
      <div class="flex-1 space-y-3">
        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <div class="h-4 w-32 bg-gray-200 rounded" />
            <div class="h-3 w-24 bg-gray-100 rounded" />
          </div>
          <div class="flex gap-2">
            <div class="h-7 w-16 bg-gray-100 rounded-lg" />
            <div class="h-7 w-16 bg-gray-100 rounded-lg" />
          </div>
        </div>
        <div class="h-3 w-40 bg-gray-100 rounded" />
        <div class="space-y-2">
          <div class="h-3 w-full bg-gray-100 rounded" />
          <div class="h-3 w-5/6 bg-gray-100 rounded" />
          <div class="h-3 w-4/6 bg-gray-100 rounded" />
        </div>
        <div class="flex gap-3 pt-2 border-t border-gray-100">
          <div class="h-5 w-24 bg-gray-100 rounded-full" />
          <div class="h-5 w-20 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
