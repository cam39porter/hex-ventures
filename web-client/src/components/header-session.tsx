// React
import * as React from "react";

// GraphQL
import {
  editSessionMutation as editSessionResponse,
  editSessionMutationVariables
} from "../__generated__/types";
import { editSession } from "../queries";
import { graphql, compose, MutationFunc } from "react-apollo";

// Components
import * as Draft from "draft-js";

// Utils
import { convertFromHTML } from "draft-convert";
import "draft-js/dist/Draft.css";
import { debounce, Cancelable } from "lodash";
import ReactResizeDetector from "react-resize-detector";

const TIME_TO_SAVE = 500; // ms

interface Props {
  editSession: MutationFunc<editSessionResponse, editSessionMutationVariables>;
  sessionId: string;
  startingTitle?: string;
}

interface State {
  editorState: Draft.EditorState;
  editorWidth: number;
}

class HeaderSession extends React.Component<Props, State> {
  saveEdit: ((text: string) => void) & Cancelable | undefined;

  constructor(props: Props) {
    super(props);

    let editorState = Draft.EditorState.createEmpty();

    if (props.startingTitle) {
      editorState = Draft.EditorState.createWithContent(
        convertFromHTML(props.startingTitle)
      );
    }

    this.saveEdit = debounce((text: string) => {
      this.props
        .editSession({
          variables: {
            sessionId: this.props.sessionId,
            title: text
          }
        })
        .catch(err => {
          console.error(err);
        });
    }, TIME_TO_SAVE);

    this.state = {
      editorState,
      editorWidth: 0
    };
  }

  handleOnChange = (editorState: Draft.EditorState) => {
    const currentContent = this.state.editorState.getCurrentContent();
    const newContent = editorState.getCurrentContent();

    // Content has changed
    if (currentContent !== newContent) {
      this.saveEdit && this.saveEdit(newContent.getPlainText());
    }

    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div className={``}>
        <ReactResizeDetector
          handleHeight={true}
          onResize={(width, _) => {
            this.setState({
              editorWidth: width
            });
          }}
        />
        <div
          className={`f4`}
          style={{
            width: `${this.state.editorWidth}px`
          }}
        >
          <Draft.Editor
            editorState={this.state.editorState}
            onChange={this.handleOnChange}
            placeholder={`Brainstorm title`}
          />
        </div>
      </div>
    );
  }
}

const withEditSession = graphql<editSessionResponse, Props>(editSession, {
  name: "editSession",
  alias: "withEditSession"
});

const ListSessionTitleWithData = compose(withEditSession)(HeaderSession);

export default ListSessionTitleWithData;