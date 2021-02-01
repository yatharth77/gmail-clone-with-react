import React, { Component } from 'react'

class Sidebar extends Component {
    constructor(props){
        super(props);
    }

    processLabels = () => {
        let labelJson = this.props.labels;
        if( typeof(labelJson) == "string"){
            labelJson = JSON.parse(labelJson);
        }
        const labelArray = labelJson["labels"]

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
                        return <li key={index}><a href="#">{value.name}</a></li>
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
 