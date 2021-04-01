import { Threads } from '../utils/dbManager'
import parse from 'html-react-parser';
import '../style/style.css'
import { useLiveQuery } from "dexie-react-hooks";
import store from "../store/index"
import { getDB } from '../utils/dbManager'
import $ from "jquery";

function ThreadList() {
    const activeLabel = store.getState().activeLabel;
    const db = getDB();
    const threadResult = useLiveQuery(
        () => db.threads.filter((thread: Threads) => thread.labels.includes(activeLabel)).toArray(),
        [activeLabel]
    );
    
    if(!threadResult) return (<div>No thread found</div>);

    const hideThreads = (threadIndex: number) => {
        console.log("testing");
        $(`#thread${threadIndex}`).toggle();
    }
    return(
        <div className="list-group">
            {
                threadResult.map((thread: Threads, threadIndex: number) => {
                    const messages = thread.messages;
                    const firstMessage = messages[0].snippet;
                    return (
                        <div key={threadIndex}>
                            <a onClick = {() => hideThreads(threadIndex)}>
                            <a href="#" className="list-group-header">{firstMessage.substring(0, 90)}. . .</a> 
                            <div className="list-group-threads" id={'thread'+threadIndex}>
                            {
                                messages.map((message, messageIndex) => {
                                    if(message.labelIds.includes('TRASH') && activeLabel != 'TRASH') return null;
                                    return (<a href="#" className="list-group-item" key={messageIndex}><p>Message {messageIndex+1}:</p>{parse(message.snippet)}</a>)
                                })
                            }
                            </div>
                            <hr className = 'divider-middle'/>
                            </a>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default ThreadList;
 