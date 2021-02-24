import React, {Component} from "react";
import { liveQuery } from "dexie"; 
import { db } from '../utils/dbManager'

const allLabelObservable = liveQuery (
  () => db.labels.toArray()
);

export class Sidebar2 extends Component {
    componentDidMount() {
    this.subscription = allLabelObservable.subscribe(
        result => {
          this.props.setLabels(result)
        },
        error => {
            console.log(error);
        }
    );
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    addNewLabel = () => {
        db.labels.add({
            "id": "TESTING_LABEL" + Date.now(), 
            "name": "TESTING_LABEL" + Date.now(), 
            "messageListVisibility": "hide",
            "labelListVisibility": "labelHide", 
            "type": "system"
        })
    }

    handleLabel = async(labelName) => {
        labelName = labelName.toUpperCase();
        const labelResults = await db.threads.filter(thread => thread.labels.includes(labelName)).toArray();
        this.props.setThreadDetails(labelResults);
    }

    render(){
        if (!this.props.labels) return null;
        return (
            <div>
                <ul className="list-unstyled components">
                    <p>Labels</p>
                    { 
                        this.props.labels.map((label, index) => 
                        <li onClick={() => this.handleLabel(label.name)} key={index}><a href="#">{label.name}</a></li>) 
                    }
                </ul>
                <button onClick={() => this.addNewLabel()}>Add Labels</button>
            </div>
        )
    }
}

export default Sidebar2