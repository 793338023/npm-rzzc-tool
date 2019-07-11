import React from 'react';
import { List, InputItem } from 'antd-mobile';

export interface IProps{}
export interface IState{
    val: string;
}

class Tant extends React.Component<IProps,IState> {
    state:IState={
        val:""
    };

    change=(val:string)=>{
        this.setState({val});
    }

    render() {
        const {val} = this.state;
        return (
            <List>
                <List.Item>
                <InputItem value={val} onChange={this.change}/>
                </List.Item>
                <List.Item>
                    <p className="list-p">{val}</p> ...
                </List.Item>
            </List>
        );
    }
}

export default Tant;