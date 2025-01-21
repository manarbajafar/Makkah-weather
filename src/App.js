import logo from './logo.svg';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import "moment/min/locales"
import { useTranslation } from 'react-i18next';

//material ui
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import { changeLanguage } from 'i18next';


const theme = createTheme({
  typography:{
    fontFamily:["IPM"],
  }
});


function App() {

  const { t, i18n } = useTranslation();

  const [temp, setTemp] = useState({
    name:"",
    number: null,
    description:"",
    max: null,
    min:null,
    icon: null
  });

  const [date, setDate]= useState("");

const [local, setLocale]= useState("ar");
  
function changeLanguage(){
  if (local=="en"){
    i18n.changeLanguage("ar")
    setLocale("ar");
    moment.locale("ar"); 
    setDate(moment().format('MMMM Do YYYY, h:mm:ss a'))
  }
  else{
    i18n.changeLanguage("en");
    setLocale("en")
    moment.locale("en"); 
    setDate(moment().format('MMMM Do YYYY, h:mm:ss a'))
  }
  
}

  let cancelAxios=null;
  useEffect(()=>{
    setDate(moment().format('MMMM Do YYYY, h:mm:ss a'))

    // Make a request for a user with a given ID
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=21.422510&lon=39.826168&appid=325bcf41560775d31b352a54cee4d2a0',
      {
        cancelToken: new axios.CancelToken((c)=>{
          cancelAxios=c;
        })
     }
    )  
      .then(function (response) {
        // handle success
        setTemp({   
          name: response.data.name, 
          number: Math.round(response.data.main.temp - 272.15),
          description: response.data.weather[0].description,
          max: Math.round(response.data.main.temp_min - 272.15),
          min: Math.round(response.data.main.temp_max - 272.15),
          icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

      return () => {
        cancelAxios();
      }
  },[])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
      <Container maxWidth="sm" style={{ height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
      <Card sx={{ minWidth: 275 }} style={{width:"80%", background:"rgb(28, 52, 91, 36%)", color:"white", padding:"0px 10px", boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",}}>
      <CardContent>

      <Stack direction="row" spacing={2} style={{ alignItems:"end", width:"100%", justifyContent:"start"}} dir="rtl">
        <Typography variant="h3" style={{ marginRight:"20px", fontWeight:"700"}} >
          {/* {temp.name} */}
          {t('city')}
        </Typography>
        <Typography variant="h6" style={{ marginRight:"20px"}} >
        {date}
        </Typography>
      </Stack>

      <hr></hr>

    <Grid container spacing={2}>
      <Grid size={4}>
        <CloudIcon style={{fontSize: "150"}}></CloudIcon>
      </Grid>
      <Grid size={8}>
      
        <Stack direction="row" spacing={2} style={{ alignItems:"end", width:"100%", justifyContent:"start"}} dir="rtl">
        <Typography variant="h1" style={{textAlign: "end"}}>
          {temp.number}
        </Typography>
        <img src={temp.icon}></img>
      </Stack>

        <div style={{textAlign: "end"}}>
        <Typography variant="h6" style={{textAlign: "end"}}>
                  {t(temp.description)}
                </Typography>
                <Stack direction="row" spacing={2} style={{ alignItems:"end", width:"100%", justifyContent:"start"}} dir="rtl">
                <h5 >{t("min")}: {temp.min}</h5>
                <h5 style={{ margin:"0px 10px"}}>|</h5>
                <h5 >{t("max")}: {temp.min}</h5>
              </Stack>
        </div>

      </Grid>
  </Grid>


      </CardContent>
    </Card>

    <div style={{ width:"80%", display:"flex", justifyContent:"start"}}>
    <Button style={{color: "white", marginTop:"10px"}} variant="text" onClick={changeLanguage}>
      {local=="en"? "Arabic": "انجليزي"}</Button>
    </div>

      </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
