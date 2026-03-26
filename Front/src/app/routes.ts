import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { PortalHome } from "./pages/PortalHome";
import { CardDetail } from "./pages/CardDetail";
import { SearchResults } from "./pages/SearchResults";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: PortalHome },
      { path: "explore/:cardId", Component: CardDetail },
      { path: "search", Component: SearchResults },
    ],
  },
]);