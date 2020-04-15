export var from = new Date().getTime() - (1000 * 60 * 60 * 24 * 7);
export var to = new Date().getTime();
export var step = (1000 * 60 * 60);

export var chartData = [
    {
        name: { 'de': 'Temperatur °C', 'en': 'temperature °C' },
        childCharts: [
            { lineChartData: { borderColor: 'green', }, ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.temp', },
            { lineChartData: { borderColor: 'red', }, ioBrokerID: 'mihome.0.devices.weather_v1_158d000321709f.temperature', }
        ],
    },
    {
        name: { 'de': 'Luftfeuchtigkeit %', 'en': 'humidity %' },
        childCharts: [
            { lineChartData: { borderColor: 'green', }, ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.humid',},
            { lineChartData: { borderColor: 'red', }, ioBrokerID: 'mihome.0.devices.weather_v1_158d000321709f.humidity',}
        ],
    },
    {
        name: { 'de': 'Luftdruck hPa', 'en': 'pressure hPa' },
        childCharts: [
            { lineChartData: { borderColor: 'red', }, ioBrokerID: 'mihome.0.devices.weather_v1_158d000321709f.pressure',}
        ],
    },
    {
        name: { 'de': 'Windgeschwindigkeit km/h', 'en': 'Windspeed km/h' },
        childCharts: [
            { lineChartData: { borderColor: 'green', }, ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.wspeed2', }
        ],
    },
    {
        name: { 'de': 'Regen mm/h', 'en': 'rain mm/h' },
        childCharts: [
            { lineChartData: { borderColor: 'green', backgroundColor: 'green' }, ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.rain', }
        ],
    }
]