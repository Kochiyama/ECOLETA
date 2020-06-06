const buttonSearch = document.querySelector("#searchPointsButton");
const buttonSeeAll = document.querySelector("#seeAllPointsButton");
const modal = document.querySelector(".modal");
const close = document.querySelector("#closeButton");

buttonSearch.addEventListener("click", () => {
  modal.classList.remove("hide");
})

buttonSeeAll.addEventListener("click", () => {
  window.location = "/allPoints"
})

close.addEventListener("click", () => {
  modal.classList.add("hide");
})