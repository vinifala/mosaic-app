import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Image from './Image';

Enzyme.configure({ adapter: new Adapter() });

test('Image renders an img tag', () => {
  const component = shallow(<Image src="https://facebook.github.io/jest/img/jest.svg" />);
  expect(component.find('img').length).toBeGreaterThan(0);
});
