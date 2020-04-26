import React from 'react';


export class Hello extends React.Component<{name:string}>
{

  render()
  {
     return <h1>Hello {this.props.name}!</h1>;
  }
}
