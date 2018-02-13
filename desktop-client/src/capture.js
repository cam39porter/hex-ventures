import React, { Component } from "react";

class Capture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("Check out your capture:" + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="Capture">
        <form className={`pa4 black-80`} onSubmit={this.handleSubmit}>
          <label className={`f6 b db mb2`}>Capture</label>
          <textarea
            id="comment"
            name="comment"
            className={`db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2`}
            placeholder="Enter thoughts here"
            aria-describedby="comment-desc"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Capture;
