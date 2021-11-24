export default () => {
  const content = document.querySelector(".content");

  fetch("./pages/zucchini/zucchini.html")
    .then((response) => response.text())
    .then((zucchiniHtml) => {
      content.innerHTML = zucchiniHtml;
    });
};
