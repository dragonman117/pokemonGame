/**
 * Created by Timothy Ferrell on 2/22/17.
 */

function persistantStorage(masterKey){

    let values = {};
    let tmp = localStorage.getItem(masterKey);
    if(tmp != null){
        values = JSON.parse(tmp);
    }

    function add(key, value){
        values[key] = value;
        console.log("I has run???");
        localStorage[masterKey] = JSON.stringify(values);
    }

    function remove(key){
        delete values[key];
        localStorage[masterKey] = JSON.stringify(values);
    }

    function fetch(key){
        return values[key];
    }

    function getSize(){
        let tmp = Object.keys(values);
        return tmp.length;
    }

    function contains(key){
        if(values.hasOwnProperty(key)){
            return true;
        }
        return false;
    }

    function clearAll() {
        values = {};
        delete localStorage[masterKey];
    }

    return {
        add: add,
        remove: remove,
        fetch:fetch,
        getSize:getSize,
        contains:contains,
        clearAll:clearAll
    }
}