// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  tokens,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { app } from "@microsoft/teams-js";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import TabConfig from "./TabConfig";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
import Games from "./Games";
import Tab from "./Tab";
import TabDisplayContext from "./TabDisplayContext";
import { MainMenu } from "./MainMenu";
import TurnBasedCombat from "../game-files/MightAndMalice/TurnBasedCombat";
import SnakesGame from "../game-files/SnakesAndLadders/SnakesGame";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const [tabDisplay, setTabDisplay] = useState("");

  const { loading, theme, themeString, teamsUserCredential } =
    useTeamsUserCredential({
      initiateLoginEndpoint: config.initiateLoginEndpoint,
      clientId: config.clientId,
    });
  useEffect(() => {
    loading &&
      app.initialize().then(() => {
        // Hide the loading indicator.
        app.notifySuccess();
      });
  }, [loading]);

  useEffect(() => {
    setTabDisplay(JSON.parse(localStorage.getItem("tabDisplay")));
  }, []);

  useEffect(() => {
    localStorage.setItem("tabDisplay", JSON.stringify(tabDisplay));
  }, [tabDisplay]);

  console.log(tabDisplay);
  return (
    <TeamsFxContext.Provider
      value={{ theme, themeString, teamsUserCredential }}
    >
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : {
                ...teamsLightTheme,
                colorNeutralBackground3: "#eeeeee",
              }
        }
        style={{ background: tokens.colorNeutralBackground3 }}
      >
        <TabDisplayContext.Provider value={{ tabDisplay, setTabDisplay }}>
          <Router>
            {!loading && (
              <Routes>
                <Route path="/might-and-malice" element={<TurnBasedCombat />} />
                <Route path="/snakes-and-ladders" element={<SnakesGame />} />
                <Route path="/game" element={<Games />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/termsofuse" element={<TermsOfUse />} />
                <Route path="/tab" element={<Tab />} />
                <Route path="/config" element={<TabConfig />} />
                <Route path="*" element={<Navigate to={"/game"} />}></Route>
              </Routes>
            )}
          </Router>
        </TabDisplayContext.Provider>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
