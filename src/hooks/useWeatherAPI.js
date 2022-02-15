
import React,{useState, useEffect, useCallback} from 'react';

const fetchCurrentWeather=({authorizationKey,locationName})=>{

    return  fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
      .then((response)=>response.json())
      .then((data)=>{
        console.log('data',data)
        const locationData = data.records.location[0];
    
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (['WDSD', 'TEMP'].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          });
    
    
          return{
            locationName: locationData.locationName,
            windSpeed:weatherElements.WDSD,
            temperature:weatherElements.TEMP,
            observationTime:locationData.time.obsTime,
          }
    
      });
    }
    
    
    const fetchWeatherForecast=({authorizationKey,cityName})=>{
    
    
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
    .then((response)=>response.json())
    .then((data)=>{
      console.log('data',data)
      const locationData = data.records.location[0];
    
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (['Wx', 'PoP','CI'].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        }, {}
        );
    
        console.log(weatherElements);
    
        return{
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
        }
    });
    }
    

const useWeatherAPI = ({locationName,cityName,authorizationKey}) =>{
    const [weatherElement,setWeatherElement] = useState({})

    const fetchData = useCallback(async()=>{
        const [currentWeather,weatherForecast] = await Promise.all([
            fetchCurrentWeather=({authorizationKey,locationName}),
            fetchWeatherForecast=({authorizationKey,cityName}),
        ]);
    },[authorizationKey,cityName,locationName]);
    
    useEffect(()=>{fetchData()},[fetchData]);

    return [weatherElement,fetchData];
}

export default useWeatherAPI;