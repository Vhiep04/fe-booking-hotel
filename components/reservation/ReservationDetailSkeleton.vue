<template>
  <div class="grid grid-cols-[1fr_340px] gap-6 animate-pulse">
    <div class="space-y-5">
      <div class="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <div class="h-52 bg-gray-200" />
        <div class="p-5 grid grid-cols-3 gap-4">
          <div class="space-y-2">
            <div class="h-3 bg-gray-100 rounded w-12" />
            <div class="h-4 bg-gray-200 rounded w-24" />
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-100 rounded w-12" />
            <div class="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-100 rounded w-14" />
            <div class="h-4 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-100">
        <div class="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div class="grid grid-cols-3 gap-6">
          <div class="bg-gray-100 rounded-xl h-20" />
          <div class="bg-gray-50 rounded-xl h-20" />
          <div class="bg-gray-100 rounded-xl h-20" />
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-40 mb-2" />
        <div v-for="i in 4" :key="i" class="flex justify-between">
          <div class="h-3 bg-gray-100 rounded w-32" />
          <div class="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
    <div class="space-y-4">
      <div class="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
        <div class="h-4 bg-gray-200 rounded w-32" />
        <div v-for="i in 3" :key="i" class="flex gap-2">
          <div class="w-5 h-5 bg-gray-200 rounded-full" />
          <div class="space-y-1 flex-1">
            <div class="h-2 bg-gray-100 rounded w-20" />
            <div class="h-3 bg-gray-200 rounded w-28" />
          </div>
        </div>
        <div class="h-9 bg-gray-100 rounded-lg" />
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-20" />
        <div class="h-9 bg-gray-100 rounded-lg" />
        <div class="h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
</template>
