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
            console.log(e, e.target.value, e.target.files);
            this.setState({ uploading: true });
            getBase64(e.target.files[0]).then(encodedImage =>
              axios({
                method: 'POST',
                url: 'http://localhost:3001/upload-image',
                data: { image: encodedImage },
              })
                .catch(console.log)
                // .then(({ data }) => this.setState({ link: data.data.link })),
                // TODO: create img element for uploaded image
                .then(({ data }) => {
                  this.setState({ uploading: false, img: `${data.data.link}?t=${new Date().getTime()}` });
                }));
          }}
        />
        {this.state.uploading && <div>Sending image...</div>}
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
