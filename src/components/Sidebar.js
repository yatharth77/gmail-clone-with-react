import React, { Component } from 'react'
import Dexie from 'dexie'

class Sidebar extends Component {
    constructor(props){
        super(props);
    }

    handleLabel = async (labelName, setThreadDetails) => {
        labelName = labelName.toUpperCase();
        const db = await new Dexie("flockdev07@gmail").open()
        const dataTable = db.table("threads");
        dataTable.filter(function(thread){
            return (thread.labels.includes(labelName));
        }).toArray(data => {
                setThreadDetails(data);
        });
    }
    
    processLabels = () => {
        let labelArray = this.props.labels;
        if(!labelArray){
            return (
                <ul className="list-unstyled components">
                </ul>
            )
        }

        return (
            <ul className="list-unstyled components">
                <p>Labels</p>
                {
                    labelArray.map((value, index) => {
                        return <li onClick={() => this.handleLabel(value.name, this.props.setThreadDetails)} key={index}><a href="#">{value.name}</a></li>
                    })
                }
            </ul>
        )
    }

    render(){
        if (this.props.signedInState) {
            return this.processLabels();
        }
        else{
            return (<ul></ul>)
        }
    }

}

export default Sidebar;
 