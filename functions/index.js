import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const fbb = onDocumentCreated({ document: "/fbqueue/{documentId}", timeoutSeconds: 30, memory: "256MB", }, async (event) => {

    const snapshot = event.data;
    const data = snapshot.data();
    const facebook = data.facebook;
    const list_id = data.list_id;
    const obj_id = data.obj_id;
    const facebook_without_slash = facebook.endsWith("/") ? facebook.slice(0, -1) : facebook;
    const facebook_with_about = facebook_without_slash + "/about";

    const response = await fetch("https://cbwscu6x0j.execute-api.us-west-2.amazonaws.com/default/fb-scrape-0", {
    "body": JSON.stringify({
        facebook: facebook_with_about,
        list_id: list_id,
        obj_id: obj_id
    }),
    "method": "POST",
    });
    
    const json = await response.json();
    console.log(json.fbEmail);

    return "Function Complete";
});
