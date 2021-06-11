const idb= indexedDB.open('iBudget',1);
let db;


idb.addEventListener('upgradeNeeded',event=>{
    db = event.target.result;
    db.createObjectStore("waiting",{autoIncrement:true});
});

idb.addEventListener('success',event=>{
    db = event.target.result;
    if(navigator.onLine) handleTransactions();
});

idb.addEventListener('error',event=>{
    console.error('indexed db error',event.target.errorCode);
});

window.addEventListener("online",handleTransactions);

function handleTransactions(){
    const transaction = db.transaction(["waiting"],"readwrite");
    const store = transaction.objectStore ("waiting");
    const getTransactions = store.getAll();
    getTransactions.addEventListener("success",()=>{
        if(getTransactions.result.length>0){
            fetch("/api/transaction/bulk",{
                method:"post", body:JSON.stringify(getTransactions.result),headers:{"Content-Type":"application/json"}
            }).then(res=>res.json()).then(()=>{
                const transaction = db.transaction(["waiting"],"readwrite");
                const store = transaction.objectStore ("waiting");
                store.clear();
            });
        }
    });  
}
