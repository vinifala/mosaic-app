import axios from 'axios';
import 'regenerator-runtime/runtime';
import React from 'react';

import { useShareMosaicOnImgur } from './useShareMosaicOnImgur';

const dispatchMock = jest.fn();
const stateMock = {
  shareUrl: '',
  isSharing: false,
  sharingErrorMessage: '',
};
jest
  .spyOn(React, 'useReducer')
  .mockImplementation(() => [stateMock, dispatchMock]);

jest.mock('../../utils/toBase64', () => ({
  toBase64: () => Promise.resolve('thisisabase64string'),
}));

const axiosPostSpy = jest.spyOn(axios, 'post');

const okResponseMock = {
  data: { data: { link: 'https://foo.bar/baz.png' } },
};
const canvasRefMock = {
  current: {
    toBlob: callback => {
      callback({ foo: 'bar' });
    },
  },
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('Share mosaic on Imgur', () => {
  const [, share] = useShareMosaicOnImgur();
  describe('Happy path', () => {
    it('should dispatch success', async () => {
      axiosPostSpy.mockImplementation(() => Promise.resolve(okResponseMock));

      await share(canvasRefMock)();

      expect(dispatchMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: 'UPLOADING' }),
      );
      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: 'UPLOAD_SUCCESSFUL',
        payload: { shareUrl: 'https://foo.bar/baz.png' },
      });
    });
  });

  describe('Unhappy path', () => {
    it('should dispatch failiure', async () => {
      axiosPostSpy.mockImplementation(() => Promise.reject());

      await share(canvasRefMock)();

      expect(dispatchMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: 'UPLOADING' }),
      );
      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: 'UPLOAD_FAILIURE',
      });
    });
  });
});
