<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="modelValue"
        class="payment-loading-overlay"
        aria-live="polite"
        aria-label="Đang xử lý"
      >
        <div class="payment-loading-popup">
          <!-- Animated illustration -->
          <div class="popup-icon-wrapper">
            <div class="pulse-ring" />
            <div class="pulse-ring delay-1" />
            <!-- <img
              src="/images/loading-mascot.png"
              alt=""
              class="popup-mascot"
              @error="showFallback = true"
            /> -->
            <div v-if="showFallback" class="popup-mascot-fallback">
              <i class="pi pi-spin pi-spinner" />
            </div>
          </div>

          <h2 class="popup-title">Xin chờ một lát!</h2>
          <p class="popup-desc">{{ message }}</p>

          <!-- Progress dots -->
          <div class="popup-dots">
            <span class="dot" />
            <span class="dot delay-200" />
            <span class="dot delay-400" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    message?: string;
  }>(),
  {
    message: "Hệ thống đang xử lý đặt phòng của bạn...",
  },
);

const showFallback = ref(false);
</script>

<style scoped>
.payment-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.payment-loading-popup {
  background: #ffffff;
  border-radius: 20px;
  padding: 2.5rem 2rem 2rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.popup-icon-wrapper {
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.pulse-ring {
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.3);
  animation: pulse-expand 2s ease-out infinite;
}

.pulse-ring.delay-1 {
  animation-delay: 1s;
}

@keyframes pulse-expand {
  0% {
    transform: scale(0.9);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.popup-mascot {
  width: 80px;
  height: 80px;
  object-fit: contain;
  animation: float 2.5s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

.popup-mascot-fallback {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #3b82f6;
  position: relative;
  z-index: 1;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #7c3aed;
  margin: 0.25rem 0 0;
  letter-spacing: -0.01em;
}

.popup-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  max-width: 280px;
}

.popup-dots {
  display: flex;
  gap: 6px;
  margin-top: 0.5rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7c3aed;
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.dot.delay-200 {
  animation-delay: 0.2s;
}

.dot.delay-400 {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-active .payment-loading-popup,
.overlay-fade-leave-active .payment-loading-popup {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.overlay-fade-enter-from .payment-loading-popup {
  transform: scale(0.9) translateY(10px);
  opacity: 0;
}
.overlay-fade-leave-to .payment-loading-popup {
  transform: scale(0.9) translateY(10px);
  opacity: 0;
}
</style>
