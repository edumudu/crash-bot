
<script setup lang="ts">
import { reactive } from 'vue';
import { $ } from 'vue/macros';

import { CASHOUT_MULTIPLIER, EVENT, START_BET_AMOUT } from '../constants';
import { onEvent, sendEventToBackground } from '../utils';
import { useExtensionSessionStorage } from './composables';

let isBetting = $(useExtensionSessionStorage('isBetting', false));

const betConfig = reactive({
  startAmount: START_BET_AMOUT,
  cashout: CASHOUT_MULTIPLIER,
});

function handleSubmit() {
  if (isBetting) {
    sendEventToBackground(EVENT.STOP_BETTING);
    isBetting = false;
  } else {
    isBetting = true;

    sendEventToBackground(EVENT.START_BETTING, {
      amount: betConfig.startAmount,
      cashoutMultiplier: betConfig.cashout,
    });
  }
}

onEvent(EVENT.START_BETTING, () => {
  isBetting = true;
});

onEvent(EVENT.STOP_BETTING, () => {
  isBetting = false;
});
</script>

<template>
  <main class="flex grid-place-center w-56 p-3 bg-slate-700 text-white">
    <form class="flex flex-col gap-2 mx-auto" @submit.prevent="handleSubmit">
      <label class="flex flex-col">
        <span>Start amount</span>

        <input
          readonly
          type="text"
          class="text-white border border-gray-200 px-2 py-1 rounded bg-transparent"
          v-model="betConfig.startAmount"
         >
      </label>

      <label class="flex flex-col">
        <span>Cashout</span>

        <input
          readonly
          type="text"
          class="text-white border border-gray-200 px-2 py-1 rounded bg-transparent"
          v-model="betConfig.cashout"
        >
      </label>

      <button type="submit" class="mt-5 border-gray-200 border p-2 rounded">
        {{ isBetting ? 'Stop' : 'Start' }}
      </button>
    </form>
  </main>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
