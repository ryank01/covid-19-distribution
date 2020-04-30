import React from 'react';
import CountryData from './CountryData';
import { Container, Row, Col, Button} from 'react-bootstrap'
import SelectBox from './SelectBox';
import  { ReactWorldCountriesMap }  from "react-world-countries-map";   

export default class CovidData extends React.Component {
    constructor() {
        super();
        this.state = {
            countryArr: [],
            data: {},
            worldStats: {},
            selectedCounty: "",
           }
        this.getData = this.getData.bind(this);
        this.backToGlobalNumbers = this.backToGlobalNumbers.bind(this);
        fetch("https://pomber.github.io/covid19/timeseries.json")
            .then(response => response.json())
            .then(data => {
                var worldStats = { confirmed: 0, recovered: 0, deaths: 0 };
                var countryArr = Object.keys(data).map(i => i);
                countryArr.forEach((country) => {
                    let countryData = data[country];
                    // pick last object for today data
                    countryData = countryData[countryData.length - 1];
                    worldStats.confirmed += countryData.confirmed;
                    worldStats.recovered += countryData.recovered;
                    worldStats.deaths += countryData.deaths;
                });
                // world data
                var worldChart = [];
                countryArr.forEach((country) => {
                    let countryData = data[country];
                    countryData.forEach((dailyData, index) => {
                        if (worldChart[index] === undefined) {
                            var worldStats = { date: dailyData.date, confirmed: dailyData.confirmed, recovered: dailyData.recovered, deaths: dailyData.deaths };
                            worldChart.push(worldStats);
                        } else {
                            worldChart[index].confirmed += dailyData.confirmed;
                            worldChart[index].recovered += dailyData.recovered;
                            worldChart[index].deaths += dailyData.deaths;
                        }
                    });

                });
                this.setState({
                    countryArr: countryArr,
                    data: data,
                    worldStats: worldStats,
                    worldChart: worldChart,
                });
            });

    }



    getData(event) {
        var country = event.target.value;
        if (country !== "select") {
            this.setState({
                selectedCountry: country,
            });
        } else {
            this.setState({
                selectedCountry: "",
            })
        }
    }

    backToGlobalNumbers() {
        this.setState({
            selectedCountry: "",
        })
    }
    render() {
        const countryStats = this.state.data[this.state.selectedCountry];
        const worldChart = this.state.worldChart;
        const lastUpdated = worldChart!==undefined?worldChart[worldChart.length-1].date:"";
        // world map data
        const data =
        [
            { country: "cn", value: 1389618778 }, // china
            { country: "in", value: 1311559204 }, // india
            { country: "us", value: 331883986 },  // united states
            { country: "id", value: 264935824 },  // indonesia
            { country: "pk", value: 210797836 },  // pakistan
            { country: "br", value: 210301591 },  // brazil
            { country: "ng", value: 208679114 },  // nigeria
            { country: "bd", value: 161062905 },  // bangladesh
            { country: "ru", value: 141944641 },  // russia
            { country: "mx", value: 127318112 }   // mexico
        ]   
        return (
            <Container fluid style={{ backgroundColor: '#f8f8ff', padding: 0 }} className="App">
                {/*Header starts here */}
                <Row className="App-header">
                    <Col md={2} style={{ textAlign: 'left' }}>
                        Covid-19 Data
                    </Col>
                    {/*Select Box for country search ends here */}
                    <SelectBox onChangeFunction={this.getData} countryArr={this.state.countryArr} selectedValue={this.state.selectedCountry}/>
                </Row>
                {/*Header ends here */}
                <Row>
                     {/*Get back to global numbers */}
                    <Col md={{span:1}} xs={1}>
                    {this.state.selectedCountry ? 
                         <Button className='back' onClick={this.backToGlobalNumbers}>Back</Button>
                  : <></>}
                    </Col> 
                </Row>
                <Container fluid style={{ color: '#f5deb3', padding: 0 }} className="App">
                    {this.state.selectedCountry ? 
                        <CountryData stats={countryStats} selectedCountry={this.state.selectedCountry} /> : 
                        <CountryData stats={worldChart} selectedCountry="Worldwide Distribution"/>
                        }
                     <div className="map">
                        <div className="placeholder">
                            <ReactWorldCountriesMap tooltipBgColor="black" color="blue" value-suffix="people" size="lg" data={data} />
                        </div>
                     </div>
                </Container>
                <footer>
                    <Row className="App-footer">
                        <Col md={2} xs={5}>
                        {/*Last updated */}
                        Last Updated: {lastUpdated}
                        </Col>
                        <Col md={{span:1, offset:9}} xs={{span:3, offset:4}}>
                            <a href="https://github.com/pomber/covid19">Datasource</a>
                        
                        </Col>
                    </Row>
                </footer>
            </Container>
        )
    }

}