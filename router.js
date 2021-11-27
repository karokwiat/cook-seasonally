import renderMain from "./pages/main/main.js";
import renderBrussels from "./pages/brussels/brussels.js";
import renderPumpkin from "./pages/pumpkin/pumpkin.js";
import renderZucchini from "./pages/zucchini/zucchini.js";

export default function () {
  const router = new Navigo("/", { hash: true });

  router
    .on({
      "/": () => {
        // call updatePageLinks to let navigo handle the links
        // when new links have been inserted into the dom
        renderMain().then(router.updatePageLinks);
      },
      brussels: () => {
        renderBrussels();
      },
      pumpkin: () => {
        renderPumpkin();
      },
      zucchini: () => {
        renderZucchini();
      },
    })
    .resolve();
}
