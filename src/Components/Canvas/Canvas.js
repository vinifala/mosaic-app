import React, { Component } from 'react';
import propTypes from 'prop-types';

class Canvas extends Component {
  updateCanvas = () => {
    const { img } = this.props;
    const { canvas } = this;
    console.log('canvas', canvas, 'img', img, img.naturalWidth, img.naturalHeight, canvas.width, canvas.height);
    const ctx = canvas.getContext('2d');

    // simulate background: 'cover'
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, canvas.width, canvas.height);
  };

  componentDidUpdate = this.updateCanvas;
  componentDidMount = this.updateCanvas;

  render() {
    return (
      <canvas
        width="320px"
        height="320px"
        ref={(canvas) => {
          this.canvas = canvas;
        }}
      />
    );
  }
}

/*
window.onload = function() {
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    var img=document.getElementById("scream");
    ctx.drawImage(img,10,10);
};
*/

export default Canvas;

Canvas.defaultProps = {
  img: null,
};

Canvas.propTypes = {
  img: propTypes.object,
};
