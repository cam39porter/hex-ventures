// React
import * as React from "react";

// GraphQL
import {
  sendFeedback as sendFeedbackResponse,
  sendFeedbackVariables
} from "../../__generated__/types";
import { graphql, compose, MutationFunc } from "react-apollo";
import { sendFeedback } from "../../queries";

// Components
import ChevronUp from "../buttons/button-chevron-up";
import ChevronDown from "../buttons/button-chevron-down";
import ButtonSend from "../buttons/button-send";
import { ErrorsUtils } from "../../utils/index";

// Utils

// Types
interface Props {
  sendFeedback: MutationFunc<sendFeedbackResponse, sendFeedbackVariables>;
}

interface State {
  feedback: string;
  isMinimized: boolean;
  placeholder: string;
}

const FEEDBACK_PLEASE =
  "Please speak your mind. We appreciate brutal honesty, ruthless candor, etc.";
const THANK_YOU = "Thank you for your feedback!";

// Class
class Feedback extends React.PureComponent<Props, State> {
  constructor(nextProps: Props) {
    super(nextProps);

    this.state = {
      feedback: "",
      isMinimized: true,
      placeholder: FEEDBACK_PLEASE
    };
  }

  render() {
    return (
      <div
        className={`flex-column pa1 br2 bg-gray`}
        style={{
          width: "25em"
        }}
      >
        <div
          className={`flex justify-between pa2 near-white pointer`}
          onClick={() => {
            this.setState({
              placeholder: this.state.isMinimized ? FEEDBACK_PLEASE : THANK_YOU,
              isMinimized: !this.state.isMinimized
            });
          }}
        >
          <div>We love feedback!</div>
          {!this.state.isMinimized ? <ChevronDown /> : <ChevronUp />}
        </div>
        {!this.state.isMinimized && (
          <div className={`flex-column h5 pa2 br`}>
            <textarea
              className={`flex-grow pa2 w-100 dark-gray br2 br--top f6 bg-white`}
              style={{
                resize: "none"
              }}
              placeholder={this.state.placeholder}
              value={this.state.feedback}
              onChange={e => {
                this.setState({
                  feedback: e.target.value
                });
              }}
            />
            <div
              className={`flex justify-between w-100 pa2 br2 br--bottom accent bg-white`}
            >
              <div />
              <div
                className={`flex pointer`}
                onClick={() => {
                  if (this.state.feedback) {
                    this.props
                      .sendFeedback({
                        variables: {
                          body: this.state.feedback
                        }
                      })
                      .then(() => {
                        this.setState({
                          feedback: "",
                          placeholder: THANK_YOU
                        });
                      })
                      .catch(err => {
                        ErrorsUtils.errorHandler.report(err.message, err.stack);
                      });
                  }
                }}
              >
                <div className={`flex-column justify-around f6`}>Send</div>
                <div className={`flex-column justify-around ph2`}>
                  <ButtonSend />
                </div>
              </div>
            </div>
            <div
              className={`pb2 pt3 f6 near-white tc pointer dim`}
              onClick={e => {
                e.stopPropagation();
                window.location.href = `mailto:alpha@usetangle.com?subject=Feedback&body=${
                  this.state.feedback
                }`;
              }}
            >
              Or <span className={`bb b--accent`}>click here</span> to send an
              email with screenshots
            </div>
          </div>
        )}
      </div>
    );
  }
}

const withSendFeedback = graphql<sendFeedbackResponse, Props>(sendFeedback, {
  name: "sendFeedback",
  alias: "withSendFeedback"
});

// Export
export default compose(withSendFeedback)(Feedback);
