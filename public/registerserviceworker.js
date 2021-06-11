if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js")
    .then (reg=> console.log("service worker registered"));
}
