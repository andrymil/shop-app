export function showLoader() {
  document.getElementById('loader-overlay').classList.remove('hidden');
}

export function hideLoader() {
  document.getElementById('loader-overlay').classList.add('hidden');
}
