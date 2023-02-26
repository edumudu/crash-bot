import { ref, computed } from 'vue';

export function useExtensionSessionStorage(key: string, defaultValue: boolean) {
  const value = ref(defaultValue);

  chrome.storage.session.get([key]).then((result) => {
    const storagedValue = result[key];

    if (storagedValue) {
      value.value = storagedValue;
    } else {
      chrome.storage.session.set({ [key]: defaultValue });
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (!changes[key]) return;

    value.value = changes[key].newValue;
  });

  return computed({
    get() {
      return value.value;
    },
    set(newValue) {
      value.value = newValue;
      chrome.storage.session.set({ [key]: newValue });
    },
  });
}
