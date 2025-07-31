import promptSync from 'prompt-sync';
import fs from "fs";

const prompt = promptSync({ sigint: true });

class DAte{
    constructor(str, year, month, day)
    {
        this.str = str
        this.year = year;
        this.month = month;
        this.day = day;
    }

    setDate(y, m, d)
    {
        this.year = y;
        this.month = m;
        this.day = d;
    }

    isBefore(other)
    {
        return ((this.year < other.year) 
        || (this.year === other.year && this.month < other.month )
        || (this.year === other.year && this.month === other.month && this.day < other.day)
        );
    }
    isAfter(other)
    {
        return other.isBefore(this);
    }

    isEqual(other)
    {
        return (this.year === other.year && 
                this.month === other.month &&
                this.day === other.day);
    }

    isGreaterThanOrequal(other)
    {
        return (this.isAfter(other) || this.isEqual(other));
    }

    isLessThanOrEqual(other)
    {
        return (this.isBefore(other) || this.isEqual(other));
    }

    getStr()
    {
        return this.str;
    }
}






class weatherData{
    constructor(date, temperature, humidity, windSpeed, weatherCondition)
    {
        
        this.temperature = temperature
        this.humidity = humidity
        this.weatherCondition = weatherCondition
        this.windSpeed = windSpeed

        let year, month, day;
        let isValid = false;
        while(!isValid)
        {
            const result = this.validateDate(date);
            isValid= result[0];

            if(!isValid)
            {
                date = prompt("Invalid format. Enter a valid date(YYYY-MM-DD): ");
            }
            else{
                year = result[1];
                month = result[2];
                day = result[3];
            }
        }
        this.date = new DAte(date, year, month, day);


    }

    validateDate(datestr)
    {
        try{
            const parts = datestr.split("-");
            if(parts.length !== 3)
                throw new Error("Invalid format.")

            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);

            if(isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31)
                throw new Error("Invalid date values");

            return [true, year, month, day];
        }
        catch(e){
            console.log("Invalid date format " + e.message);
            return [false];
        }
    }

    setDate()
    {
        let valid = false;
        let year, month, day, input;

        while(!valid)
        {
            input = prompt("Enter Date Format(yyyy-mm-dd): ");
            const result = this.validateDate(input);

            valid = result[0];

            if(!valid)
            {
                alert("Invalid format.");
                continue;
            }
            [, year,month, day] = result;

            this.date = new DAte(input, year, month, day);
            console.log(this.date.getStr());
        }

    }

    validateTemp(temp)
    {
        return temp >= -50 && temp <= 60;
    }
    validateHumidity(h)
    {
        return h >=0 && h <=100;
    }

    setTemp()
    {
        let temp;
        let validate = false;
        while(!validate)
        {
            input = prompt("Enter temperature in celsius");
            temp = parseInt(input);
            valid = this.validateTemp(temp);

            if(!valid)
            {
                alert("Enter temperature between -50'c and 60'c ")
            }
        }
        this.temperature = temp;
        console.log("Tmeperature set to ", this.temperature + "'c")
    }
    setHumidity()
    {
        let valid = false;
        let humid;

        while(!valid)
        {
            const input = prompt("Enter humidity between 0% or 100%");
            humid = parseFloat(input);

            valid = this.validateHumidity(humid);
            if(!valid)
            {
                alert("Enter humidity between 0 and 100");
            }
        }
        this.humidity = humid;
        console.log("The humdity is set to ", this.humidity + "%");

    }

    setWindSpeed()
    {
        let windspeed;
        let valid = false;

        while(!valid)
        {
            let input = prompt("Enter windspeed (must be positive).");
            windspeed = parseInt(input);
            valid = windspeed >= 0;

            if(!valid)
            {
                alert("Enter positive windspeed. ");
            }
        }
        this.windSpeed = windspeed;
        console.log("Windspeed set to: ", this.windSpeed +"%");
    }
    setWthrcndn()
    {
        let input = prompt("Input weather condition: ");
        this.weatherCondition = input.toLowerCase(); 
        console.log("WeatherCondition is set to: ", this.weatherCondition);
    }

    addWeater()
    {
        this.setDate();
        this.setTemp();
        this.setHumidity();
        this.setWindSpeed();
        this.setWthrcndn(); 
    }
    getDate()
    {
        return this.date;
    }
    getHumidity()
    {
        return this.humidity;
    }
    getTemp()
    {
        return this.temperature;
    }
    getWindSpeed()
    {
        return this.windSpeed;
    }
    getWthrCndn()
    {
        return this.weatherCondition;
    }
    print()
    {
        console.log("Date: ", this.date.getStr());
        console.log("Temp: ", this.temperature);
        console.log("Humidity: ", this.humidity);
        console.log("Windspeed: ", this.windSpeed);
        console.log("Weather Condition: ", this.weatherCondition);

    }

}
const RAINY = 0, SNOWY = 1, SUNNY = 2, CLOUDY = 3, thresholdTempSpike = 5, humidityExtremeLow = 20, humidityExtremeHigh = 90;
class WeatherDatabase{
    constructor()
    {
        this.data = [];
    }

    validateDate(datestr)
    {
        try{
            const parts = datestr.split("-");
            if(parts.length !== 3)
                throw new Error("Invalid format.")

            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            const day = parseInt(parts[2]);

            if(isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day >>31)
                throw new Error("Invalid date values");

            return [true, year, month, day];
        }
        catch(e){
            console.log("Invalid date format " + e.message);
            return [false];
        }
    }

    static descendingTemperature(a, b)
    {
        return a.getTemp() - b.getTemp();
    }
    sortByDescending()
    {
        this.data.sort(WeatherDatabase.descendingTemperature);
    }
    addWeather(wthrData)
    {
        this.data.push(wthrData);
    }
    avgTemp(dta)
    {
        let tempSum = 0;

        for(const a of dta)
        {
            tempSum += a.getTemp();
        }
        return tempSum/dta.length;
    }

    avgHumidity(dta)
    {
        let humiditySum = 0;

        for (const a of dta)
        {
            humiditySum += a.getHumidity();
        }
        return humiditySum/dta.length;
    }
    avgWndSpd(dta)
    {
        let wndSum = 0;

        for(const a of dta)
        {
            wndSum += a.getWindSpeed();
        }
        return wndSum/dta.length;
    }
    noOfRainyDays(dta)
    {
        let rainyDays = 0;

        for(const a of dta)
        {
            if(a.getWthrCndn().toLowerCase() === "rainy")
            {
                rainyDays++;
            }
        }
        return rainyDays;
    }

    commonWeather(dta)
    {
        const wthr = [0, 0, 0, 0];

        for(const a of dta)
        {
            const weather = a.getWthrCndn().toLowerCase();

            if( weather === "rainy")
            {
                wthr[RAINY]++;
            }
            else if(weather === "snowy")
            {
                wthr[SNOWY]++;
            }
            else if( weather === "cloudy")
            {
                wthr[CLOUDY]++;
            }
            else if( weather === "sunny")
            {
                wthr[SUNNY]++;
            }
        }

        const max =Math.max(...wthr);
        const index = wthr.indexOf(max);

        return index !== -1 ? index : Math.floor(Math.random()*4);
    }

    commonWeatherWrapper()
    {
        const n = this.commonWeather(this.data);

        switch(n)
        {
            case SUNNY:
                return "Sunny";
            case CLOUDY:
                return "Cloudy";
            case RAINY:
                return "Rainy";
            case SNOWY:
                return "snowy";
            default:
                return "Unknown";
                
        }
    }

    minMaxTemp(dta)
    {
        dta.sort(WeatherDatabase.descendingTemperature);
        console.log("Maximium Temperature");
        dta[0].print();
        console.log();

        console.log("Minimum Temperature");
        dta[dta.length - 1].print();
        console.log();
    }

    celsisuToFarenheit(celsius)
    {
        return celsius*(9/5) + 32;
    }
    farenheitToCelsisu(farenheit)
    {
        return (farenheit-32)*(5/9);
    }
    celsisusToKelvin(celsius)
    {
        return celsius + 273.15;
    }
    kelvinToCelsius(kelvin)
    {
        return kelvin - 273.15;
    }
    getVector()
    {
        return this.data;
    }
    printAll()
    {
        for(const a of this.data)
        {
            a.print();
            console.log();
        }
    }
    sortDataTemp(dta)
    {
        dta.sort(WeatherDatabase.descendingTemperature);
    }
    print(dta)
    {
        for (const a of dta)
        {
            a.print();
            console.log();
        }
    }
     task4()
     {
        this.sortDataTemp(this.data);
        console.log("Weather ecords sorted by descending temperature: ")
        this.printAll();
        console.log();
        console.log("Average Temperature: " + this.avgTemp(this.data).toFixed(2)+ "'c");
        console.log("Average Humidity: "+  this.avgHumidity(this.data).toFixed(2)+"%");
        console.log("Average Wind Speed "+ this.avgWndSpd(this.data).toFixed(2)+"km/h");
        console.log("Total rainy days: " + this.noOfRainyDays(this.data));
        console.log("Most common weather: "+  this.commonWeatherWrapper()+"\n");

        this.minMaxTemp(this.data);

     }

     sortAccDate(date1, date2)
     {
        const dta = [];

        for (const a of this.data)
        {
            const dateEntry = a.getDate();
            if(dateEntry.isAfter(date1) && dateEntry.isBefore(date2))
            {
                dta.push(a);
            }
        }

        return dta;
     }

     wrappperSortAccDate()
     {
        let date1s = prompt("Input starting date range format(YYYY-MM-DD): ");
        let year, month , day;
        let valid;

        do{
            [valid, year, month, day] = this.validateDate(date1s);
            if(!valid)
            {
                alert("Invalid format ");
                date1s = prompt("Input starting date range format(YYYY-MM-DD): ");
            }
        }while(!valid);
        const date1 = new DAte(date1s, year, month, day);

        let date2s = prompt("Input date for endiing range format(YYYY-MM-DD): ");

        do{
            [valid,year, month, day] = this.validateDate(date2s);
            if(!valid)
            {
                alert("Invalid format")
                date2s = prompt("Input date for ending range (YYYY-MM-DD): ");
            }
        }while(!valid);

        const date2 = new DAte(date2s, year, month , day);

        return this.sortAccDate(date1, date2);

     }

     warning(temp1, temp2)
     {
        const dta = [];

        for (const a of this.data)
        {
            if(a.getTemp() >= temp1 && a.getTemp() <= temp2)
            {
                dta.push(a);
            }
        }

        console.log(`\n WARNINGS FOR TEMPERATURE BETWEEN ${temp1} AND ${temp2}.\n`);
        this.print(dta);
     }

     generateReport()
     {
        const dta = this.wrappperSortAccDate();

        const temp1 = parseInt(prompt("Input lower temperature range:"));
        const temp2 = parseInt(prompt("Input upper temperature range: "));

        console.log("\n Data between given date ranges:");
        this.print(dta);
        console.log();

    console.log(`Average Temperature: ${this.avgTemp(dta).toFixed(2)}°C`);
    console.log(`Average Humidity: ${this.avgHumidity(dta).toFixed(2)}%`);
    console.log(`Average Wind Speed: ${this.avgWndSpd(dta).toFixed(2)} km/h`);
    console.log(`Total Rainy Days: ${this.noOfRainyDays(dta)}`);
    console.log(`Most Common Weather: ${this.commonWeatherWrapper()}`);

    this.minMaxTemp(dta);
    console.log();
    this.warning(temp1, temp2);
     }


     analyzeWeatherCondition()
     {
        let result = {
            summerDays: [],winterDays: [], autumnDays: [], springDays: []
            ,tempSpike:[],humidityExtreme: [], recommendation: [] 
        };

        const srtDta = this.wrappperSortAccDate();
        for(let i = 0; i < srtDta.length; i++)
        {
            let a = srtDta[i];
            let date = a.getDate().getStr();
            let temp = a.getTemp();
            let humidity = a.getHumidity();
            
            if(temp < 10)
            {
                result.winterDays.push(date);
            }
            else if(temp < 20)
            {
                result.springDays.push(date);
            }
            else if(temp < 30)
            {
                result.autumnDays.push(date);
            }
            else
            {
                result.summerDays.push(date);
            }

            if (humidity <= humidityExtremeLow || humidity >= humidityExtremeHigh)
            {
                result.humidityExtreme.push(date + ` (${humidity}%)`);
            }

            if(i > 0)
            {
                let prevTemp = srtDta[i-1].getTemp();
                if(Math.abs(prevTemp - temp)>= thresholdTempSpike)
                {
                    result.tempSpike.push(`(${srtDta[i-1].getDate().getStr()}, ${date} ) -> ( ${prevTemp}, ${temp} )`);
                }
            }


        }
        if(result.summerDays.length > result.winterDays.length)
        {
            result.recommendation.push(`Long warm period detected stay hydrated and avoid outdoor activities during daytime.`)
        }
        if(result.humidityExtreme.length > 0)
        {
            result.recommendation.push(`Extreme humidity detectd. Ensure proper ventilation or use dehumidifier.`)
        }
        if(result.tempSpike > 0)
        {
            result.recommendation.push(`Temperature instability detected. Take precautions.`);
        }
        return result;
     }

     printAnalysis()
     {
        let analysis = this.analyzeWeatherCondition();
        console.log(`\nWeather Analysis`)
        console.log(`Summer days: ${analysis.summerDays.length}`);
        console.log(`Winter days: ${analysis.winterDays.length}`);
        console.log(`Spring days: ${analysis.springDays.length}`);
        console.log(`Autumn days: ${analysis.autumnDays.length}`);
        console.log(`\nTemperature spikes: ${analysis.tempSpike}`);
        console.log(`Humidity Extremes: ${analysis.humidityExtreme}`);
        console.log(`\nRecommendations`);
        for(const a of analysis.recommendation)
        {
            console.log(`-${a}\n`);
        }

     }
     convertToCSV()
     {
        const header = `Date,Temperature,Humidity,WindSpeed,WeatherCondition`;
        const rows = this.data.map(entry => `${entry.getDate().getStr()},${entry.getTemp()},${entry.getHumidity()},${entry.getWindSpeed()},${entry.getWthrCndn()}`)
        
        return [header, ...rows].join("\n");
    }

    saveToCsv()
    {
        fs.writeFileSync("output.csv",this.convertToCSV(),(err)=>
        {
            if(err)
            {
                return console.error(`Error while trying to write file. ${err}`);
            }
        });
    }


}



function main()
{
    const db = new WeatherDatabase();

    const dummy1 = new weatherData("2025-07-10", 35, 65, 20, "Sunny");
    const dummy2 = new weatherData("2025-07-11", 30, 75, 15, "Snowy");
    const dummy3 = new weatherData("2025-07-12", 40, 60, 25, "Snowy");
    const dummy4 = new weatherData("2025-07-13", 28, 80, 12, "cloudy");
    const dummy5 = new weatherData("2025-07-14", 38, 55, 30, "rainy");

    db.addWeather(dummy1);
    db.addWeather(dummy2);
    db.addWeather(dummy3);
    db.addWeather(dummy4);
    db.addWeather(dummy5);

    console.log("\n Weather Records (Original Records): ");
    // db.printAll();
    console.log();

     //db.generateReport();
    db.printAnalysis();
    console.log(db.convertToCSV());
    db.saveToCsv();




}

main();