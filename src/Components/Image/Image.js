import React, { Component } from 'react';
// import propTypes from 'prop-types';

// TODO: refactor to pure function using recompose
// TODO: refactor to antdesign cards
class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  handleImageLoad = () => this.setState({ loading: false });

  render() {
    return (
      <div>
        {this.state.loading && <div>Loading...</div>}
        <img
          alt="test"
          onLoad={this.handleImageLoad}
          {...this.props}
          style={{ width: '100%', display: this.state.loading ? 'none' : 'block' }}
        />
      </div>
    );
  }
}

export default Image;
