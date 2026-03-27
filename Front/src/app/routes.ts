import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { PortalHome } from "./pages/PortalHome";
import { CardDetail } from "./pages/CardDetail";
import { SearchResults } from "./pages/SearchResults";
import { Mentorat } from "./pages/Mentorat";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: PortalHome },
      { path: "explore/:cardId", Component: CardDetail },
      { path: "search", Component: SearchResults },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "mentorat", Component: Mentorat },
    ],
  },
]);