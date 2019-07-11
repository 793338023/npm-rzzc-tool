import React from 'react';
import {Animator} from './tAnimateUtil';

export interface IProps {}
export interface IState {
    left: number;
}

class TAinamte extends React.Component<IProps,IState>{
    state:IState={
        left: 0
    }
    anmimate:any;
    move:any;
    constructor(props){
        super(props);
        this.anmimate = ()=>{};
    }

    componentDidMount(){
        // sss
    this.anmimate = new Animator({
            targetVal:100,
            curVal:100,
            step:0.6,
            point:2,
            easeType:'Quad-easeInOut',
            update:(val)=>{
                console.log(val);
                this.move.style.left = val + "px";
            },
            complete:function(){
                console.log('complete...');
            }
        });
    }

    step(){
        this.anmimate.step();
    }

    render(){
        return (
            <div className="move-wrapper">
                <button onClick={this.step.bind(this)}>开始</button>
                <div className="move" ref={(el)=>{this.move = el}}></div>
            </div>
        );
    }
}

export default TAinamte;