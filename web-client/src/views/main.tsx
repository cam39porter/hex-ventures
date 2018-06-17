// React
import * as React from "react";

// Router
import { RouteComponentProps, Switch, Route } from "react-router";

// Components
import Session from "../views/session";
import Navigation from "../components/navigation";
import Surface from "./surface";
import Capture from "./capture";

// Utils
import { NetworkUtils } from "../utils";
import windowSize from "react-window-size";

// Constants

// Types
interface RouteProps extends RouteComponentProps<{}> {}

interface Props extends RouteProps {
  // Window Size
  windowWidth: number;
  windowHeight: number;
}

interface State {}

// Class
class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    // let isLargeWindow = WindowUtils.getIsLargeWindow(this.props.windowWidth);

    return (
      <div className={`flex w-100 vh-100 bg-near-white`}>
        {/* Navigation */}
        <div className={`flex`}>
          <Route component={Navigation} />
        </div>
        <div className={`relative flex-grow`}>
          {/* Capture */}
          {NetworkUtils.getCapture(this.props.location.search) && (
            <div className={`absolute top-0 left-0 z-max vh-100 w-100`}>
              <Capture />
            </div>
          )}
          <div className={`flex`}>
            {/* Session */}
            <Switch>
              <Route path={`/session/:id`} component={Session} />
            </Switch>

            {/* Surface */}
            <Switch>
              <Route path={`/session/:id`} component={Surface} />
              <Route path={`/`} component={Surface} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

//  Window
const MainWithWindowSize = windowSize(Main);

// Export
export default MainWithWindowSize;
