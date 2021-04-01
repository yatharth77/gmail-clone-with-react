import store from "../store/index"

export class ApiManager {
    user: string;
    accessToken: string;
    
    static BASE_URL = 'https://gmail.googleapis.com/gmail/v1/users/';
    constructor(user: string){
        this.user = user;
        this.accessToken = store.getState().accessToken;
    }

    fetchAPI(objectName?: string, objectId?: string, dataString?: string) {
        if(!objectName) objectName = "";
        if(!objectId) objectId = "";
        return new Promise((resolve, reject) => {
            let url = ApiManager.BASE_URL + this.user + '/' + objectName + '/' + objectId;
            if(dataString){
                url = url + '/?' + dataString;
            }
            var xhr = new XMLHttpRequest()
            xhr.open('GET', url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
            xhr.send();
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    const error = xhr.statusText || 'The reason is mysterious. Call Yoda!';
                    reject(error);
                }
            };
        })
    }
}
