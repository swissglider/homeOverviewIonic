import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, ViewChild, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { IOBrokerService } from 'src/app/homeoverview/_global/services/iobroker.service/iobroker.service';
import { bindCallback } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { DEF_getLineChartOptions } from './def.lineChartOptions';


@Component({
    selector: 'app-charting',
    templateUrl: 'charting.component.html',
    styleUrls: ['charting.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartingComponent implements OnInit, AfterViewInit, OnDestroy {
    public overview: {current:{x,y},max:{x,y},min:{x,y},selected:{x,y}, }[] = [{
        current:{x:'',y:''},max:{x:'',y:''},min:{x:'',y:''},selected:{x:'',y:''},
    },{
        current:{x:'',y:''},max:{x:'',y:''},min:{x:'',y:''},selected:{x:'',y:''},
    },{
        current:{x:'',y:''},max:{x:'',y:''},min:{x:'',y:''},selected:{x:'',y:''},
    },{
        current:{x:'',y:''},max:{x:'',y:''},min:{x:'',y:''},selected:{x:'',y:''},
    },{
        current:{x:'',y:''},max:{x:'',y:''},min:{x:'',y:''},selected:{x:'',y:''},
    }];
    public lineChartDatas: ChartDataSets[][] = [
        [{
            data: [], label: 'Temperatur °C', borderColor: [],
            datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
        }],
        [
            {
                // data: [], label: 'Hum', yAxisID: 'y-axis-1',
                data: [], label: 'Hum',
                datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } },
                backgroundColor: 'rgba(255,0,0,0.3)',
                borderColor: 'green',
                pointBackgroundColor: 'rgba(148,159,177,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(148,159,177,0.8)'
            }],
        [
            {
                // data: [], label: 'Hum', yAxisID: 'y-axis-1',
                data: [], label: 'Wind',
                datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
            }],
        [
            {
                // data: [], label: 'Hum', yAxisID: 'y-axis-1',
                data: [], label: 'Luftdruck',
                datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
            }],
        [
            {
                // data: [], label: 'Hum', yAxisID: 'y-axis-1',
                data: [], label: 'Regen',
                datalabels: { align: function (context) { return context.active ? 'start' : 'center'; } }
            }],
    ];
    public lineChartLabels: Label[] = [];
    public lineChartOptions: (ChartOptions & { annotation: any }) = DEF_getLineChartOptions();
    public lineChartLegend = true;
    public lineChartType = 'line';
    // public lineChartPlugins = [ChartDataLabels, pluginAnnotations];
    public lineChartPlugins = [pluginAnnotations];

    // @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>

    constructor(
        private ioBrokerService: IOBrokerService,
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        let onWeekAgo = new Date().getTime() - (1000 * 60 * 60 * 24 * 7);
        let now = new Date().getTime();
        this.getData('jeelink.1.LaCrosseWS_balkon.temp', onWeekAgo, now, 0, 0);
        this.getData('jeelink.1.LaCrosseWS_balkon.humid', onWeekAgo, now, 1, 0);
        this.getData('jeelink.1.LaCrosseWS_balkon.wspeed2', onWeekAgo, now, 2, 0);
        this.getData('mihome.0.devices.weather_v1_158d000321709f.pressure', onWeekAgo, now, 3, 0);
        this.getData('jeelink.1.LaCrosseWS_balkon.rain', onWeekAgo, now, 4, 0);
    }

    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        // console.log('chartClicked', event, active);
    }

    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
        active.forEach(e => {
            let index = e['_index'];
            this.charts.forEach((child) => {
                this.setAnnotation(child, 0, index);
                this.setSelected(child, 0, index);
                this.openTooltips(child.chart, 0, index);
            });
        })
    }

    ngAfterViewInit(): void { }

    ngOnDestroy(): void { }

    getData(id: string, from: number, to: number, chartNumber, dataSetNumber) {
        const observable = bindCallback(this.ioBrokerService.sendTo).bind(this.ioBrokerService);
        let obs$ = observable('influxdb.0', 'getHistory', {
            id: id,
            options: {
                start: from,
                end: to,
                step: (1000 * 60 * 60),
                limit: false,
                aggregate: 'average',
            }
        });
        obs$.subscribe((result) => {
            // console.log(result.result);
            let results = result.result.map(e => { return { x: new Date(e.ts), y: e.val } })
            this.overview[chartNumber] = {
                current: results[results.length - 1],
                max: results.find(e=> e.y === Math.max(...results.map(e=>e.y))),
                min: results.find(e=> e.y === Math.min(...results.map(e=>e.y))),
                selected:{x:'', y:''},
            }
            this.ref.markForCheck();
            this.lineChartDatas[chartNumber][dataSetNumber].data = results;
            if (this.lineChartDatas[chartNumber][dataSetNumber].label === 'Temperatur °C') {
                this.lineChartDatas[chartNumber][dataSetNumber].pointBackgroundColor = (context) => {
                    var index = context.dataIndex;
                    var value = context.dataset.data[index]['y'];
                    return value < 0 ? 'blue' : 'red';
                };
            }
            this.charts.forEach((child) => {
                child.chart.update()
            });
        })
    }

    openTooltips(oChart, datasetIndex, pointIndex) {
        if (oChart.tooltip._active == undefined)
            oChart.tooltip._active = []
        var activeElements = oChart.tooltip._active;
        var requestedElem = oChart.getDatasetMeta(datasetIndex).data[pointIndex];
        for (var i = 0; i < activeElements.length; i++) {
            if (requestedElem._index == activeElements[i]._index)
                return;
        }
        // activeElements.push(requestedElem);
        activeElements = [requestedElem];
        oChart.tooltip._active = activeElements;
        oChart.tooltip.update(true);
        oChart.draw();
    }

    setSelected(child, datasetIndex, pointIndex) {
        let index = this.lineChartDatas.findIndex(e => e[0].label === child.datasets[datasetIndex].label)
        this.overview[index].selected = child.datasets[datasetIndex].data[pointIndex];
    }

    setAnnotation(child, datasetIndex, pointIndex) {
        let anno = {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            // value: time,
            borderColor: 'orange',
            borderWidth: 2,
            label: {
                backgroundColor: 'rgba(4,16,47,0.8)',
                enabled: true,
                fontColor: '#FD2B28',
                fontSize: 10,
                position: "center",
                // content: [label, time, value + '°C', 'Guido']
            }
        }
        if(pointIndex <= child.datasets[datasetIndex].data.length/2){
            anno['label']['xAdjust'] = 70;
            anno['label']['yAdjust'] = -10;
        } else {
            anno['label']['xAdjust'] = -70;
            anno['label']['yAdjust'] = -10;
        }
        let time = child.datasets[datasetIndex].data[pointIndex]['x'];
        let value = child.datasets[datasetIndex].data[pointIndex]['y'];
        let label = child.datasets[datasetIndex].label;
        anno['value'] = time;
        // anno.label['content'] = [label, new Date(time).toLocaleString(), value]
        child.chart.options['annotation'].annotations = [anno];
        child.chart.update();
    }
}