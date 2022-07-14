import  React from 'react';
import renderer from 'react-test-renderer';
import {DeleteWidget, DWProps} from '../DeleteWidget';

class WrapperComponent extends React.Component
{
    constructor(props: DWProps)
    {
      super(props);
    }

    render()
    {
      return <DeleteWidget  name={this.props.name} onDelete={this.props.onDelete} />;
    }
}

test('Base render', () => {
  let onDelete = jest.fn(() => {});
  let component = renderer.create(<DeleteWidget name="Fred" onDelete={onDelete} />);
  
  expect(component.root.findAllByProps({className:"button delete"}).length).toBe(1);
});

test('check Confirm', async () => {
  let onDelete = jest.fn(() => {});
  let component = renderer.create(<DeleteWidget name="Fred" onDelete={onDelete} />);
  
  expect(component.root.findAllByProps({className:"button yes"}).length).toBe(0);
  expect(component.root.findAllByProps({className:"button no"}).length).toBe(0);
  component.root.findAllByProps({className:"button delete"})[0].props.onClick();
  expect(component.root.findAllByProps({className:"button yes"}).length).toBe(1);
  expect(component.root.findAllByProps({className:"button no"}).length).toBe(1);
  expect(component.root.findAllByProps({className:"button delete"}).length).toBe(0);
});

test('click No', async () => {
  let onDelete = jest.fn(() => {});
  let component = renderer.create(<DeleteWidget name="Fred" onDelete={onDelete} />);
  
  component.root.findAllByProps({className:"button delete"})[0].props.onClick();
  component.root.findAllByProps({className:"button no"})[0].props.onClick();
  expect(component.root.findAllByProps({className:"button yes"}).length).toBe(0);
  expect(component.root.findAllByProps({className:"button no"}).length).toBe(0);
  expect(component.root.findAllByProps({className:"button delete"}).length).toBe(1);
  expect(onDelete.mock.calls.length).toBe(0);
});

test('click Yes', async () => {
  let onDelete = jest.fn(() => {});
  let component = renderer.create(<DeleteWidget name="Fred" onDelete={onDelete} />);
  
  component.root.findAllByProps({className:"button delete"})[0].props.onClick();
  component.root.findAllByProps({className:"button yes"})[0].props.onClick();
  expect(component.root.findAllByProps({className:"button yes"}).length).toBe(0);
  expect(component.root.findAllByProps({className:"button no"}).length).toBe(0);
  expect(component.root.findAllByProps({className:"button delete"}).length).toBe(1);
  expect(onDelete.mock.calls.length).toBe(1);
});
