
import { ChartOptions } from 'chart.js';

export const DEF_getLineChartOptions = ():(ChartOptions & { annotation: any }) => {
    return {
        responsive: true,
    aspectRatio: 4 / 3,
    tooltips: {
        enabled: false,
        mode: 'x-axis',
    },
    legend: { display: false },
    title: { display: true, text: 'Hallo', fontSize: 10, position: 'top', padding: 0 },
    layout: {
        padding: {
            // bottom: 25,
            right: 20,
            left: 10,
            // top: 50
        },
    },
    // tooltips: {
    //     enabled: true,
    //     mode: 'nearest',
    //     // custom: function (tooltipModel) {
    //     //     //Top-Left
    //     //     tooltipModel.x = 10;
    //     //     tooltipModel.y = 0;
    //     // }.bind(this)
    // },
    // animation: {
    //     duration: 0
    // },
    elements: {
        point: {
            radius: 0,
        },
        line: {
            fill: false
        }
    },
    scales: {
        xAxes: [{
            id: 'x-axis-0',
            type: 'time',
            distribution: "linear",
            time: {
                unit: 'day',
                unitStepSize: 1,
                displayFormats: { 'day': 'ddd', }
            },
            ticks: { display: false },
        }],
        yAxes: [
            {
                id: 'y-axis-0',
                position: 'left',
                ticks: { display: true },
                gridLines: { display: true },
                scaleLabel: { display: false },
                // stacked: true,
            },
        ],
    },
    annotation: {
        annotations: [
            {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 'March',
                borderColor: 'orange',
                borderWidth: 2,
                label: {
                    enabled: true,
                    fontColor: 'orange',
                    content: 'LineAnno'
                }
            },
        ],
    },
    hover: {
        mode: 'index',
        intersect: false
    },
    plugins: {
        // legend: false,
        // title: true,
        // datalabels: {
        //     // display: false,
        //     // backgroundColor: (context) => {
        //     //     return context.active ? context.dataset.backgroundColor : 'white';
        //     // },
        //     backgroundColor: (context) => context.active ? context.dataset.backgroundColor.toString() : 'white',
        //     borderColor: (context) => context.dataset.backgroundColor.toString(),
        //     borderRadius: (context) => context.active ? 0 : 32,
        //     borderWidth: 1,
        //     color: (context) => context.active ? 'white' : context.dataset.backgroundColor.toString(),
        //     font: {
        //         weight: 'bold'
        //     },
        //     formatter: function (value, context) {
        //         let time = new Date(value.x).toLocaleString();
        //         let val = Math.round(value.y * 100) / 100;
        //         return context.active
        //             ? context.dataset.label + '\n' + time + '\n' + val + '°C'
        //             // : Math.round(val);
        //             : null;
        //     }.bind(this),
        //     offset: 8,
        //     textAlign: 'center',
        //     labels: {
        //         title: {
        //             font: {
        //                 weight: 'bold'
        //             }
        //         },
        //         value: {
        //             color: 'blue'
        //         }
        //     },
        // },
    },
    }
}