import { onDocumentCreated } from "firebase-functions/v2/firestore";
// import { updateDoc, arrayUnion, doc, runTransaction, collection, addDoc } from 'firebase/firestore';
// import { db } from "./firebase.js";
import { gotScraping } from 'got-scraping';
import randUserAgent from "rand-user-agent";

export const fbb = onDocumentCreated({ document: "/fbqueue/{documentId}", timeoutSeconds: 30, memory: "256MB", }, async (event) => {

    const snapshot = event.data;
    const data = snapshot.data();
    const facebook = data.facebook;
    const list_id = data.list_id;
    const obj_id = data.obj_id;
    // check if link ends with a "/" if so remove it
    const facebook_without_slash = data.facebook.endsWith("/") ? data.facebook.slice(0, -1) : data.facebook;
    const facebook_with_about = facebook_without_slash + "/about";

    let fbEmail = "";
        const agent = randUserAgent("desktop");
        const random_datr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        // const response = await gotScraping({
        //     url: facebook,
        //     headers: {
        //       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        //       "accept-language": "en-US,en;q=0.9",
        //       "cache-control": "max-age=0",
        //       "dpr": "2",
        //       "sec-ch-prefers-color-scheme": "light",
        //       "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
        //       "sec-ch-ua-full-version-list": "\"Not/A)Brand\";v=\"99.0.0.0\", \"Google Chrome\";v=\"115.0.5790.102\", \"Chromium\";v=\"115.0.5790.102\"",
        //       "sec-ch-ua-mobile": "?1",
        //       "sec-ch-ua-model": "\"Nexus 5\"",
        //       "sec-ch-ua-platform": "\"Android\"",
        //       "sec-ch-ua-platform-version": "\"6.0\"",
        //       "sec-fetch-dest": "document",
        //       "sec-fetch-mode": "navigate",
        //       "sec-fetch-site": "none",
        //       "sec-fetch-user": "?1",
        //       "upgrade-insecure-requests": "1",
        //       "viewport-width": "555",
        //       "cookie": `dpr=2; datr=${random_datr}; wd=555x1500`
        //     },
        // });

        // const html = response.body; 
        
        const response = await fetch(facebook, {
          "credentials": "include",
          "headers": {
              "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Alt-Used": "www.facebook.com",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "none",
              "Sec-Fetch-User": "?1"
          },
          "method": "GET",
          "mode": "cors"
      });
      
      const html = await response.text()


        const FBEmailRegex = /([a-zA-Z0-9._-]+\\u0040[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g

        try {
            const fbEmails = html.match(FBEmailRegex)
            const fbEmailOne  = fbEmails[0]
            fbEmail = fbEmailOne.replace("\\u0040", "@")
        } catch {
            // console.log("error")
        }

        
    console.log("fbEmail", fbEmail)
    return "Function Complete";
});

// await uploadToFirebase(list_id, obj_id, html, fbEmail);

// async function uploadToFirebase(list_id, obj_id, html, fbemail) {
//     const docRef = doc(db, `sheets/${list_id}`)
//     await runTransaction(db, async (transaction) => {
//         const userSnapshot = await transaction.get(docRef);
//         const listsArray = userSnapshot.data().lists;
//         const targetIndex = listsArray.findIndex((list) => list.sheetItemId === obj_id);

//         if (targetIndex !== -1) {
//             listsArray[targetIndex].fbemail = fbemail ? fbemail : "";
//         }
//         transaction.update(docRef, { lists: listsArray });
//     });
// }