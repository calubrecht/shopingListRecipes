
import React from 'react';

export interface DWProps
{
  name :string
  onDelete() : void
}

export interface DWState
{
  confirming :boolean,
}

export class DeleteWidget extends React.Component<DWProps, DWState>
{
  constructor(props : DWProps)
  {
    super(props);
    this.state = {confirming:false};
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  render()
  {
    if (this.state.confirming)
    {
      return <div className="deleteWidget">
        <span className="label">Are you sure?</span>
        <span className="button yes" onClick={() => this.confirmYes()}>Y </span>
        <span className="button no" onClick={() => this.confirmNo()}> N </span>
        </div>;
    }
    else
    {
      return <div className="deleteWidget"><span className="button delete" onClick={() => this.confirmDelete()} > X </span></div>;
    }
  }

  confirmDelete()
  {
    this.setState({confirming: true});
  }
  confirmYes()
  {
    this.setState({confirming: false});
    this.props.onDelete();
  }
  confirmNo()
  {
    this.setState({confirming: false});
  }

}
