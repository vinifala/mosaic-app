import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

import Alert from '../antd/Alert';
import Spin from '../antd/Spin';
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

  handleFailUpload = () =>
    this.setState({
      uploading: false,
      errorMessage:
        'Oops, something went wrong while trying to upload your image, please try again.',
      img: '',
    });

  displayImage = img => {
    this.setState({
      uploading: false,
      img,
      errorMessage: '',
    });
  };

  uploadImage = encodedImage =>
    axios({
      method: 'POST',
      url: 'http://localhost:3001/image',
      data: { image: encodedImage },
    })
      .then(this.displayImage)
      .catch(this.handleFailUpload);

  handleFileChange = e => {
    if (!e.target.files[0]) {
      return;
    }
    if (e.target.files[0].size > 1024 * 10000) {
      this.setState({
        errorMessage: 'File too large, maximum allowed size: 10Mb',
      });
      return;
    }
    if (e.target.files[0].type.search('image') !== 0) {
      this.setState({
        errorMessage: 'File type not allowed, only images, please',
      });
      return;
    }
    this.setState({ uploading: true, errorMessage: '' });
    toBase64(e.target.files[0])
      .then(this.displayImage)
      .catch(this.handleFailUpload);
  };

  render() {
    const { uploading, errorMessage, img } = this.state;
    return (
      <div>
        <h2>...or upload an image</h2>
        <input
          accept="image/*"
          disabled={uploading}
          type="file"
          onChange={this.handleFileChange}
        />
        {uploading && (
          <div>
            <Spin tip="Sending image..." />
          </div>
        )}
        {errorMessage && (
          <div>
            <Alert message={errorMessage} type="error" showIcon />
          </div>
        )}
        {!uploading && img && <Image src={img} {...this.props} autoSelect />}
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
