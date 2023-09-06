import { createRouter, createWebHashHistory } from "vue-router";
import CrashView from "../views/CrashView.vue";
import LimboView from "../views/LimboView.vue";
import DiceView from "../views/DiceView.vue";
import MinesView from "../views/MinesView.vue";
import KenoView from "../views/KenoView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/crash" },
    {
      path: "/crash",
      name: "crash-verify",
      component: CrashView,
    },
    {
      path: "/limbo",
      name: "limbo-verify",
      component: LimboView,
    },
    {
      path: "/dice",
      name: "dice-verify",
      component: DiceView,
    },
    {
      path: "/mines",
      name: "mines-verify",
      component: MinesView,
    },
    {
      path: "/keno",
      name: "keno-verify",
      component: KenoView,
    },
  ],
});

export default router;
