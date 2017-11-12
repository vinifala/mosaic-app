import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from './App';

Enzyme.configure({ adapter: new Adapter() });

test('It renders its core components', () => {
  const component = shallow(<App />);

  // renders itself
  expect(component.find('.App').length).toBeGreaterThan(0);

  // renders Gallery
  expect(component.find('Gallery').length).toBeGreaterThan(0);

  // renders FileUpload
  expect(component.find('FileUpload').length).toBeGreaterThan(0);

  // renders Mosaic
  expect(component.find('Mosaic').length).toBeGreaterThan(0);
});
