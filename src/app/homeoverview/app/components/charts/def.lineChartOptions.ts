
import { ChartOptions } from 'chart.js';

export const DEF_getLineChartOptions = (): (ChartOptions & { annotation: any }) => {
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
                scaleLabel: {
                    display: false
                },
                id: 'x-axis-0',
                type: 'time',
                distribution: "linear",
                time: {
                    unit: 'day',
                    unitStepSize: 1,
                    displayFormats: { 'day': 'ddd', }
                },
                ticks: { display: true, fontSize: 8, padding: 0 },
            }],
            yAxes: [
                {
                    scaleLabel: {
                        display: false
                    },
                    id: 'y-axis-0',
                    position: 'left',
                    ticks: { display: true, fontSize: 8, padding: 0 },
                    gridLines: { display: true },
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
            crosshair: {
                line: {
                    //   color: '#F66',  // crosshair line color
                    color: 'blue',  // crosshair line color
                    width: 1        // crosshair line width
                },
                sync: {
                    enabled: true,            // enable trace line syncing with other charts
                    group: 1,                 // chart group
                    suppressTooltips: false   // suppress tooltips when showing a synced tracer
                },
                zoom: {
                  enabled: false,                                      // enable zooming
                //   zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',     // background color of zoom box 
                //   zoomboxBorderColor: '#48F',                         // border color of zoom box
                //   zoomButtonText: 'Reset Zoom',                       // reset zoom button text
                //   zoomButtonClass: 'reset-zoom',                      // reset zoom button class
                },
                // callbacks: {
                //     beforeZoom: function (start, end) {                  // called before zoom, return false to prevent zoom
                //         return true;
                //     },
                //     afterZoom: function (start, end) {                   // called after zoom
                //     }
                // }
            },
            zoom: {
                // Container for pan options
                pan: {
                    // Boolean to enable panning
                    enabled: false,

                    // Panning directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow panning in the y direction
                    // A function that is called as the user is panning and returns the
                    // available directions can also be used:
                    //   mode: function({ chart }) {
                    //     return 'xy';
                    //   },
                    mode: 'x',

                    rangeMin: {
                        // Format of min pan range depends on scale type
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        // Format of max pan range depends on scale type
                        x: null,
                        y: null
                    },

                    // On category scale, factor of pan velocity
                    speed: 20,

                    // Minimal pan distance required before actually applying pan
                    threshold: 10,

                    // Function called while the user is panning
                    // onPan: onPan,
                    // Function called once panning is completed
                    onPanComplete: function ({ chart }) { console.log(`I was panned!!!`, chart); }
                },

                // Container for zoom options
                zoom: {
                    // Boolean to enable zooming
                    enabled: true,

                    // Enable drag-to-zoom behavior
                    // drag: true,

                    // Drag-to-zoom effect can be customized
                    drag: {
                    	 borderColor: 'rgba(225,225,225,0.3)',
                    	 borderWidth: 5,
                    	 backgroundColor: 'rgb(225,225,225)',
                    	 animationDuration: 0
                    },

                    // Zooming directions. Remove the appropriate direction to disable
                    // Eg. 'y' would only allow zooming in the y direction
                    // A function that is called as the user is zooming and returns the
                    // available directions can also be used:
                    //   mode: function({ chart }) {
                    //     return 'xy';
                    //   },
                    mode: 'x',

                    rangeMin: {
                        // Format of min zoom range depends on scale type
                        x: null,
                        y: null
                    },
                    rangeMax: {
                        // Format of max zoom range depends on scale type
                        x: null,
                        y: null
                    },

                    // Speed of zoom via mouse wheel
                    // (percentage of zoom on a wheel event)
                    speed: 0.1,

                    // On category scale, minimal zoom level before actually applying zoom
                    sensitivity: 3,

                    // Function called while the user is zooming
                    // onZoom: function ({ chart }) { console.log(`I'm zooming!!!`); },
                    // Function called once zooming is completed
                    onZoomComplete: function ({ chart }) { console.log(`I was zoomed!!!`, chart); }
                }
            }
        },
    }
}