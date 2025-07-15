let snackbarTimeout;

export function showSnackbar(message = 'Item added to cart', color = 'green') {
  const snackbar = document.getElementById('snackbar');

  if (color !== 'green') {
    snackbar.classList.add('red');
  } else {
    snackbar.classList.remove('red');
  }
  snackbar.textContent = message;

  snackbar.classList.add('show');

  clearTimeout(snackbarTimeout);

  snackbarTimeout = setTimeout(() => {
    snackbar.classList.remove('show');
  }, 4000);
}
