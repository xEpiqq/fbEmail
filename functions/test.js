async function heyThere() {

const facebook = "https://www.facebook.com/MyBuddyThePlumber/about"
const list_id = "1"
const obj_id = "1"

const response = await fetch("https://cbwscu6x0j.execute-api.us-west-2.amazonaws.com/default/fb-scrape-0", 
{
"body": JSON.stringify({
    facebook: facebook,
    list_id: list_id,
    obj_id: obj_id
}),
"method": "POST",
});

const json = await response.json();
console.log(json.fbEmail);

}

heyThere()