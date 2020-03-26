export var chartData = {
    'temp': {
        name: { 'de': 'Temperatur', 'en': 'temperature' },
        id: 'temp',
        childCharts: {
            'temp': {
                id: 'temp',
                lineChartData: {
                    data: [], label: 'Temperatur °C', borderColor: [],
                    datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
                },
                overviewValue: { current: { x: '', y: '' }, max: { x: '', y: '' }, min: { x: '', y: '' }, selected: { x: '', y: '' } },
                ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.temp',
                from: new Date().getTime() - (1000 * 60 * 60 * 24 * 7),
                to: new Date().getTime()
            }
        },
    },
    'hum': {
        name: { 'de': 'Luftfeuchtigkeit', 'en': 'humidity' },
        id: 'hum',
        childCharts: {
            'hum': {
                id: 'hum',
                lineChartData: {
                    data: [], label: 'Hum %', borderColor: [],
                    datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
                },
                overviewValue: { current: { x: '', y: '' }, max: { x: '', y: '' }, min: { x: '', y: '' }, selected: { x: '', y: '' } },
                ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.humid',
                from: new Date().getTime() - (1000 * 60 * 60 * 24 * 7),
                to: new Date().getTime()
            }
        },
    },
    'wind': {
        name: { 'de': 'Wind', 'en': 'Wind' },
        id: 'wind',
        childCharts: {
            'wind': {
                id: 'wind',
                lineChartData: {
                    data: [], label: 'Wind km/h', borderColor: [],
                    datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
                },
                overviewValue: { current: { x: '', y: '' }, max: { x: '', y: '' }, min: { x: '', y: '' }, selected: { x: '', y: '' } },
                ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.wspeed2',
                from: new Date().getTime() - (1000 * 60 * 60 * 24 * 7),
                to: new Date().getTime()
            }
        },
    },
    'press': {
        name: { 'de': 'Luftdruck', 'en': 'pressure' },
        id: 'press',
        childCharts: {
            'press': {
                id: 'press',
                lineChartData: {
                    data: [], label: 'Pressure hPa', borderColor: [],
                    datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
                },
                overviewValue: { current: { x: '', y: '' }, max: { x: '', y: '' }, min: { x: '', y: '' }, selected: { x: '', y: '' } },
                ioBrokerID: 'mihome.0.devices.weather_v1_158d000321709f.pressure',
                from: new Date().getTime() - (1000 * 60 * 60 * 24 * 7),
                to: new Date().getTime()
            }
        },
    },
    'rain': {
        name: { 'de': 'Regen', 'en': 'rain' },
        id: 'rain',
        childCharts: {
            'rain': {
                id: 'rain',
                lineChartData: {
                    data: [], label: 'Rain', borderColor: [],
                    datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
                },
                overviewValue: { current: { x: '', y: '' }, max: { x: '', y: '' }, min: { x: '', y: '' }, selected: { x: '', y: '' } },
                ioBrokerID: 'jeelink.1.LaCrosseWS_balkon.rain',
                from: new Date().getTime() - (1000 * 60 * 60 * 24 * 7),
                to: new Date().getTime()
            }
        },
    }
}