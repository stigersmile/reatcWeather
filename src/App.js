
import './App.css';
import styled from '@emotion/styled';
import React,{useState, useEffect} from 'react';

import { ReactComponent as DayCloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';
import { ReactComponent as LoadingIcon } from './images/loading.svg';


const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;
const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;
  svg{
    width:25px;
    height:auto;
    margin-right:30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  svg{
    width:25px;
    height:auto;
    margin-right:30px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;
  svg{
    margin-left:10px;
    width:15px;
    height:15px;
    cursor:pointer;
    animation: rotate infinite 1.5s linear;
    animation-duration:${({isLoading})=>(isLoading?'1.5s':'0s')}
  }

  @keyframes rotate{
    from{
      transform:rotate(360deg);
    }
    to{
      transform: rotate(0deg)
    }
  }


`;



const AUTHORIZATION_KEY= 'CWB-D4AE8C7C-D2A0-44C1-9603-50BC3340B54F'
const LOCATION_NAME = '臺北'
const LOCATION_NAME_FORECAST = '臺北市'


const App = () => {

  console.log("invoke function component")

// read it when loading
useEffect(()=>{
  console.log("execute functino in useEffect")
  fetchCurrentWeather();
  fetchWeatherForecast();
},[])



const fetchCurrentWeather=()=>{

    setWeatherElement((prevState)=>({
      ...prevState,
      isLoading:true,  //覆蓋之前的
    }))
  

  fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
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

      setWeatherElement((preState)=>({
        ...preState,
        locationName: locationData.locationName,
        // description:'多雲時晴',
        windSpeed:weatherElements.WDSD,
        temperature:weatherElements.TEMP,
        // rainPossibility: 60,
        observationTime:locationData.time.obsTime,
        isLoading: false,

      }))
  });
}


const fetchWeatherForecast=()=>{


fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`)
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
    });

    console.log(weatherElements);
    setWeatherElement((preState)=>({
     ...preState,
    
      // description:weatherElements.Wx.parameterName,
      // weatherCode:weatherElements.Wx.parameterValue,
      rainPossibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName,
  
    }))
});
}




const [weatherElement,setWeatherElement] = useState ({
observationTime:new Date(),
locationName: '',
description:'',
windSpeed: 0,
temperature:0,
rainPossibility: 0,
isLoading: true,
weatherCode:0,
confortability:"",
  });

  const{
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    observationTime,
    isLoading,
    confortability,
  } =weatherElement;

  return (
   <Container>

    {console.log('render')}
   <WeatherCard>
    <Location>{locationName}</Location>
    <Description>{description}</Description>
    <CurrentWeather>
    <Temperature>
    {temperature}<Celsius>C</Celsius>
    </Temperature>
    <DayCloudyIcon/>
    </CurrentWeather>
    <AirFlow><AirFlowIcon/>{windSpeed} m/h</AirFlow>
    <Rain><RainIcon/>{Math.round(rainPossibility)} %</Rain>
    <Refresh isLoading ={isLoading} onClick={()=>{ fetchCurrentWeather(); fetchWeatherForecast()}}>最後觀測時間 {new Intl.DateTimeFormat('zh-Tw',{hour:"numeric",minute:"numeric"}).format(new Date(observationTime))}
    {isLoading?<LoadingIcon/>:<RefreshIcon/>}</Refresh>
    <Description>{description}{confortability}</Description>
  </WeatherCard>
  </Container>
  );
}

export default App;
