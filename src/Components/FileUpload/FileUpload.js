import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import Image from '../Image/Image';
import noop from '../../utils/noop';
import toBase64 from '../../utils/toBase64';

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      errorMessage: '',
      img: '',
    };
  }

  render() {
    return (
      <div>
        <h2>...or upload an image</h2>
        <input
          accept="image/*"
          disabled={this.state.uploading}
          type="file"
          onChange={(e) => {
            if (!e.target.files[0]) {
              return;
            }
            if (e.target.files[0].size > 1024 * 10000) {
              this.setState({ errorMessage: 'File too large, maximum allowed size: 10Mb' });
              return;
            }
            if (e.target.files[0].type.search('image') !== 0) {
              this.setState({ errorMessage: 'File type not allowed, only images, please' });
              return;
            }
            this.setState({ uploading: true, errorMessage: '' });
            console.log(Object.assign({}, e));
            toBase64(e.target.files[0])
              .then(encodedImage =>
                axios({
                  method: 'POST',
                  url: 'http://localhost:3001/image',
                  data: { image: encodedImage },
                })
                  .catch(() =>
                    this.setState({
                      uploading: false,
                      errorMessage:
                        'Oops, something went wrong while trying to upload your image, please try again later.',
                      img: '',
                    }))
                  .then(({ data }) => {
                    this.setState({
                      uploading: false,
                      img: `${data.data.link}?t=${new Date().getTime()}`,
                      errorMessage: '',
                    });
                  }))
              .catch(() =>
                this.setState({
                  uploading: false,
                  errorMessage: 'Oops, something went wrong while trying to upload your image, please try again later.',
                }));
          }}
        />
        {this.state.uploading && <div>Sending image...</div>}
        {this.state.errorMessage && <div>{this.state.errorMessage}</div>}
        {!this.state.uploading && this.state.img && <Image src={this.state.img} {...this.props} autoSelect />}
      </div>
    );
  }
}

export default FileUpload;

FileUpload.defaultProps = {
  selectImage: noop,
};

FileUpload.propTypes = {
  selectImage: propTypes.func,
};
