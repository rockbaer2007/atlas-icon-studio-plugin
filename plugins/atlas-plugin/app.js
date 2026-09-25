const button = document.querySelector("#example-button");
const result = document.querySelector("#result");

button.addEventListener("click", () => {
  result.textContent = "The plugin page is running.";
});
