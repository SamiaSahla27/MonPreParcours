import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { PortalHome } from "./pages/PortalHome";
import { CardDetail } from "./pages/CardDetail";
import { SearchResults } from "./pages/SearchResults";
import { DeveloperSimulation } from "./pages/DeveloperSimulation";
import { SimulateurExplorePage } from "./pages/SimulateurExplorePage";
import { SimulationMissionPage } from "./pages/SimulationMissionPage";
import { SimulationJourneePage } from "./pages/SimulationJourneePage";
import { Mentorat } from "./pages/Mentorat";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Mentors } from "./pages/Mentors";
import { MentorDetailPage } from "./pages/MentorDetail";
import { ProfilePage } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: PortalHome },
      { path: "explore/simulateur", Component: SimulateurExplorePage },
      { path: "explore/:cardId", Component: CardDetail },
      { path: "search", Component: SearchResults },
      { path: "simulations/developpeur-1h", Component: DeveloperSimulation },
      { path: "simulations/:slug", Component: SimulationMissionPage },
      { path: "simulations/:slug/journee", Component: SimulationJourneePage },
      { path: "mentors", Component: Mentors },
      { path: "mentors/:id", Component: MentorDetailPage },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "mentorat", Component: Mentorat },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);
