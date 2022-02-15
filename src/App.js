
import './App.css';

import React,{useState, useEffect, useMemo} from 'react';
import {getMoment} from './utils/helpers';
import WeatherCard from './views/WeatherCard';
import styled from '@emotion/styled';
import useWeatherAPI from './hooks/useWeatherAPI';


const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;



const AUTHORIZATION_KEY= 'CWB-D4AE8C7C-D2A0-44C1-9603-50BC3340B54F'
const LOCATION_NAME = '臺北'
const LOCATION_NAME_FORECAST = '臺北市'


const App = () => {

  const [weatherElement,fetchData] = useWeatherAPI({
    locationName:LOCATION_NAME,
    cityName:LOCATION_NAME_FORECAST,
    authorizationKey:AUTHORIZATION_KEY,
  })

  
// const fetchCurrentWeather=()=>{

//   return  fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
//     .then((response)=>response.json())
//     .then((data)=>{
//       console.log('data',data)
//       const locationData = data.records.location[0];
  
//       const weatherElements = locationData.weatherElement.reduce(
//         (neededElements, item) => {
//           if (['WDSD', 'TEMP'].includes(item.elementName)) {
//             neededElements[item.elementName] = item.elementValue;
//           }
//           return neededElements;
//         });
  
  
//         return{
//           locationName: locationData.locationName,
//           windSpeed:weatherElements.WDSD,
//           temperature:weatherElements.TEMP,
//           observationTime:locationData.time.obsTime,
//         }
  
//     });
//   }
  
  
//   const fetchWeatherForecast=()=>{
  
  
//   return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`)
//   .then((response)=>response.json())
//   .then((data)=>{
//     console.log('data',data)
//     const locationData = data.records.location[0];
  
//     const weatherElements = locationData.weatherElement.reduce(
//       (neededElements, item) => {
//         if (['Wx', 'PoP','CI'].includes(item.elementName)) {
//           neededElements[item.elementName] = item.time[0].parameter;
//         }
//         return neededElements;
//       }, {}
//       );
  
//       console.log(weatherElements);
  
//       return{
//         rainPossibility: weatherElements.PoP.parameterName,
//         comfortability: weatherElements.CI.parameterName,
//         description: weatherElements.Wx.parameterName,
//         weatherCode: weatherElements.Wx.parameterValue,
//       }
//   });
//   }


const moment = useMemo(()=>getMoment(LOCATION_NAME_FORECAST),[]);

// useEffect(()=>{
// setCurrentTheme(moment === 'day'?'light':'dark');
// },[moment]);

// const fetchData = async () =>{
// setWeatherElement((prevState)=>({
//     ...prevState,
//     isLoading:true,  //覆蓋之前的
//   }))
// const[currentWeather,weatherForecast] = await Promise.all([ fetchCurrentWeather(),fetchWeatherForecast()]);
// setWeatherElement({
//   ...currentWeather,
//   ...weatherForecast,
//   isLoading: false,
// }) 

// };

// useEffect(()=>{ 
// console.log("execute functino in useEffect");
// fetchData();
// },[]);





// const [weatherElement,setWeatherElement] = useState ({
// observationTime:new Date(),
// locationName: '',
// description:'',
// windSpeed: 0,
// temperature:0,
// rainPossibility: 0,
// isLoading: true,
// weatherCode:0,
// confortability:"",
//   });

//   const{
//     weatherCode,
//     locationName,
//     description,
//     windSpeed,
//     temperature,
//     rainPossibility,
//     observationTime,
//     isLoading,
//     confortability,
//   } =weatherElement;

  return (
   <Container>
   <WeatherCard
   weatherElement={weatherElement}
   moment = {moment}
   fetchData ={fetchData}
   />
  </Container>
  );
  }


export default App;
