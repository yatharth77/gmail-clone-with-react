export class ApiManager {
    static BASE_URL = 'https://gmail.googleapis.com/gmail/v1/users/';
    constructor(user, accessToken){
        this.user = user;
        this.accessToken = accessToken;
        this.objectName = "";
        this.objectId = "";
    }

    fetchAPI(objectName, objectId) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', ApiManager.BASE_URL + this.user + '/' + objectName + '/' + objectId);
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