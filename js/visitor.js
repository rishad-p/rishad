var database = firebase.database();
const now = new Date();
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
fetch('https://ipapi.co/json/').then(response => response.json()).then(data => { navigator.getBattery().then(battery => {
  var vdata = {
    ip: data.ip,
    ip_v: data.version,
    aprox_city_name: `aprox_${data.city}`,
    region: data.region,
    country_capital: data.country_capital,
    country_name: data.country_name,
    timezone: `${Intl.DateTimeFormat().resolvedOptions().timeZone}, ${now.toString().match(/\((.*?)\)/)[1]}`,
    nsp: data.org,
    platform: `${isMobile ? "Mobile" : "Desktop"} - ${navigator.platform}`,
    user_agent: navigator.userAgent,
    language: navigator.language,
    system_theme: `${isDarkMode ? "Dark Mode" : "Light Mode"}`,
    battery_level: `${Math.round(battery.level * 100)}%`,
    referrer: document.referrer || "N/A",
    url: window.location.href,
    local_time: `${now.toLocaleString()} ${now.getMilliseconds()}ms`,
    utc_time: now.toString()
  };
    database.ref('visitors').push({
        data: vdata
    }).then((row)=>{
        // console.log("01");
    }).catch((error)=>{
        console.log(error);
    });
}); });