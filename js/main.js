"use strict"
function done(){
    setTimeout(function(){
        console.log("loading");
        document.getElementById("loading").style.display ="none";
        document.getElementById("loading-spinner").style.display ="none";
    },600);
};


// Global Variables 
let key = "5dbc7d88ab574f819db204559231908";
let day_1 =[]
let day_2 =[]
let day_3 =[]
let day_4 =[]
let dates = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
// Tags to Update Left side 
let leftTemp = document.querySelector("#left-temp");
let leftText = document.querySelector("#left-text");
let leftWind = document.querySelector("#left-wind");
let leftRain = document.querySelector("#left-rain");
let leftHumidity = document.querySelector("#left-humidity");
let leftCloud = document.querySelector("#left-cloud");
let leftCity = document.querySelector("#left-city");
let leftIcon = document.querySelector("#weather-icon-img");
let leftDesc = document.querySelector("#left-description");
let rightDate = document.querySelector("#right-date");
let rightTemp = document.querySelector("#right-temp");
let rightText1 = document.querySelector(".right-text-1");
let rightText2 = document.querySelector(".right-text-2");

//get city by IP
var requestOptions = {
    method: 'GET',
};


// Get weather data 
async function forecastCity(city="cairo"){
    fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`, {
    method: 'GET',          
}).then(response => {
if (!response.ok) {
    throw response; //check the http response code and if isn't ok then throw the response as an error
}
return response.json();
}).then(response => {
//response now contains parsed JSON ready for use

updateDashandLeft(response); // pass current city data
return response;
}).catch((errorResponse) => {
if (errorResponse.text) { //additional error information
    errorResponse.text().then( errorMessage => {
    })
} else {
} 
});
}

async function daysForecast(city="cairo"){
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=3&alerts=yes`, {
    method: 'GET',          
}).then(response => {
if (!response.ok) {
    throw response; //check the http response code and if isn't ok then throw the response as an error
}
return response.json();
}).then(response => {
//response now contains parsed JSON ready for use
day_1 = response.forecast.forecastday[0];
day_2 = response.forecast.forecastday[1];
day_3 = response.forecast.forecastday[2];
day_4 = response.forecast.forecastday[3];
return response;

}).then(response => {
    updateHourly();
updateDays();
}).catch((errorResponse) => {
if (errorResponse.text) { //additional error information
    errorResponse.text().then( errorMessage => {
    })
}else{
    
} 
});

}

// //////////////

var updateDashandLeft = (city)=> {
   // Main Dashboard 
   // year , degree and city name
    let year = document.querySelector('#dash-year');
    let city_name = document.querySelector('#dash-city');
    let degree = document.querySelector('#dash-degree');
    let date = new Date(city.current.last_updated);

    year.innerHTML = `${date.getFullYear()}`;
    city_name.innerHTML= city.location.region;
    degree.innerHTML = `${day_1.hour[0].temp_c} <sup>o</sup>c`;

// Update Left side 

    leftTemp.innerHTML = `${day_1.hour[0].temp_c} <sup>o</sup>c`;
    leftText.innerHTML = day_1.day.condition.text;
    leftWind.innerHTML = `${day_1.hour[0].wind_degree} <sup>o</sup> c` ;
    leftRain.innerHTML = day_1.hour[0].chance_of_rain;
    leftHumidity.innerHTML = `${day_1.hour[0].humidity  } <sup>o</sup> c`;
    leftCloud.innerHTML = day_1.hour[0].cloud;
    rightText1.innerHTML = day_1.day.condition.text;
    rightText2.innerHTML =`feels like ${day_1.hour[0].feelslike_c} <sup>o</sup> c `;
    rightTemp.innerHTML = `${day_1.hour[0].temp_c} <sup>o</sup>c`;
    let txt = day_1.day.condition.icon;
        txt = txt.substring(txt.length -7);
    leftIcon.src =`./images/weather/${txt}` ;
    leftCity.innerHTML = city.location.region;
    rightDate.innerHTML = `last updated : ${city.current.last_updated}`;


    console.log("dashboard updated");
}


var updateHourly = (res)=> {
   // rest of ui  
    let cont = ``;
    let hours = day_1.hour;

    for(let i=0; i<hours.length-20; i++){
        let x = hours[i].temp_c;
        let txt = hours[i].condition.icon;
        txt = txt.substring(txt.length -7);
        let t = new Date(hours[i].time)
        let hour = `${t.getHours() > 9?t.getHours():"0"+(t.getHours())}: ${t.getMinutes()>9?t.getMinutes():"0"+(t.getMinutes())}`
        cont +=`
        <div class="col-6 col-md-3 pt-1 pb-3 text-center">
                        <h3 class="bg-blur d-inline px-2 py-1 text-orange opacity-75">${hour} </h3>
                        <h2 class="py-2">${x} <sup>o</sup> c </h2>
                        <div class="d-flex justify-content-center align-items-center">
                            <img src="${`./images/weather/${txt}`}">
                        </div>
                        <h3 class="text-grayed">${hours[i].condition.text}  </h3>
                    </div>
        `
    }
    document.querySelector("#hours-row").innerHTML = cont;
    
}
var updateDays = (res)=> {
    // rest of ui  
    let cont = ``;
    let days  = [day_1,day_2,day_3]
    // console.log(days);

    for(let i=0; i<days.length; i++){
        let txt = days[i].day.condition.icon;
        
        txt = txt.substring(txt.length -7);
        let date = new Date(days[i].date);
        date = date.getDay();
        date = dates[date];
        cont +=`
        <div class="col-12 col-md-4 pt-1 pb-3 text-center">
        <h3 class="bg-blur d-inline px-2 py-1 text-orange opacity-75"> ${date}</h3>
        <h2 class="py-2">${days[i].day.avgtemp_c} <sup>o</sup></h2>
        <div class="d-flex justify-content-center align-items-center m-0">
        <img src="${`./images/weather/${txt}`}">
        </div>
        <h3 class="text-grayed b-bottom m-0 mx-auto">${days[i].day.condition.text} </h3>
    </div>
        `
    }
    document.querySelector("#days-row").innerHTML = cont;
}




// daysForecast();


// get value from search 
// get new weather data upon 
// 1. user input change
// 2. user clicked a search button icon
let searchBtn = document.querySelector("#searchBtn");
let inputBtn = document.querySelector("#weather-search");


searchBtn.addEventListener('click' , function (){
    // forecast using value 
    // console.log("search btn clicked");
    
    // now we have the 4 days values
    // we should update 
    // 1. dashboard 
    // 2. left side
    // 3. update 3 parts of right (top , hourly , 4 days forecast)
    daysForecast(inputBtn.value);
    forecastCity(inputBtn.value);
});

inputBtn.addEventListener('input' , function(){
    // forecast  value searched 
    // console.log(this.value)
    daysForecast(this.value);
    forecastCity(this.value);


});

// get user location to display it's weather
let getLocation = ()=>{
    fetch("https://api.geoapify.com/v1/ipinfo?apiKey=7ca6e0d080344fbeba4ecbaa41b020b3", requestOptions)
    .then(response => response.json())
    .then(result => {
        daysForecast(result.city.name);
        forecastCity(result.city.name);
    })
    .catch(error => console.log('error', error));


}    

// Default city Call 
getLocation();
