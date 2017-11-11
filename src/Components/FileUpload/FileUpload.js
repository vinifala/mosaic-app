import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import Image from '../Image/Image';
import noop from '../../utils/noop';

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

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
        <input
          disabled={this.state.uploading}
          type="file"
          onChange={(e) => {
            this.setState({ uploading: true, errorMessage: '' });
            getBase64(e.target.files[0]).then(encodedImage =>
              axios({
                method: 'POST',
                url: 'http://localhost:3001/upload-image',
                data: { image: encodedImage },
              })
                .catch(() =>
                  this.setState({
                    uploading: false,
                    errorMessage:
                      'Oops, something went wrong while trying to upload your image, please try again later.',
                  }))
                .then(({ data }) => {
                  this.setState({
                    uploading: false,
                    img: `${data.data.link}?t=${new Date().getTime()}`,
                    errorMessage: '',
                  });
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
