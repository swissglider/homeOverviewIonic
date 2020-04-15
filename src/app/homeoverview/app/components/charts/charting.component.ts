import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, ViewChild, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective, Label, Color } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { IOBrokerService } from 'src/app/homeoverview/_global/services/iobroker.service/iobroker.service';
import { bindCallback } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { DEF_getLineChartOptions } from './def.lineChartOptions';
import { chartData, from, to, step } from './data';
import { GetNamePipe } from 'src/app/homeoverview/_global/pipes/get-name.pipe';
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { IoBStateQuery } from '../../store/state/io-bstate.query';
import * as crosshair from 'chartjs-plugin-crosshair';
import * as zoom from 'chartjs-plugin-zoom';


@Component({
    selector: 'app-charting',
    templateUrl: 'charting.component.html',
    styleUrls: ['charting.component.scss'],
    providers: [GetNamePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartingComponent implements OnInit, AfterViewInit, OnDestroy {
    public chartData = chartData;
    public from = from;
    public to = to;
    public step = step;
    @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>

    constructor(
        private ioBrokerService: IOBrokerService,
        private ref: ChangeDetectorRef,
        private objectQuery: IoBObjectQuery,
        private stateQuery: IoBStateQuery,
        private getNamePipe: GetNamePipe,
    ) { }

    ngOnInit() {
        this.chartData.forEach(chart => {
            chart['lineChartLabels'] = [];
            chart['lineChartOptions'] = DEF_getLineChartOptions();
            if('plugins' in chart['lineChartOptions'] && 'zoom' in chart['lineChartOptions']['plugins'] && 'pan' in chart['lineChartOptions']['plugins']['zoom']){
                chart['lineChartOptions']['plugins']['zoom']['pan']['onPan'] = this.onPan.bind(this);
                chart['lineChartOptions']['plugins']['zoom']['zoom']['onZoom'] = this.onPan.bind(this);
            }
            chart['lineChartOptions'].title.text = this.getNamePipe.transform(chart.name);
            chart['lineChartLegend'] = true;
            chart['lineChartType'] = 'line';
            // chart['lineChartPlugins'] = [pluginAnnotations, crosshair];
            chart['lineChartPlugins'] = [crosshair, zoom];
            chart.childCharts.forEach(childChart => {
                if (!('name' in childChart)) { (childChart as any)['name'] = this.objectQuery.getEntity(childChart['ioBrokerID']).common.name }
                if (!('lineChartData' in childChart)) { (childChart as any)['lineChartData'] = {} }
                if (!('label' in childChart['lineChartData'])) { (childChart as any)['lineChartData']['label'] = this.getNamePipe.transform(childChart['name']) }
                if (!('data' in childChart['lineChartData'])) { (childChart as any)['lineChartData']['data'] = [] }
                if (!('datalabels' in childChart['lineChartData'])) {
                    childChart['lineChartData']['datalabels'] = { align: function (context) { return context.active ? 'start' : 'center'; } };
                }
                if (!('from' in childChart)) {
                    (childChart as any)['from'] = this.from;
                }
                if (!('to' in childChart)) {
                    (childChart as any)['to'] = this.to;
                }
                if (!('step' in childChart)) {
                    (childChart as any)['step'] = this.step;
                }
                this.calculateData(childChart, chart);
            });
            chart['dataset'] = (chart.childCharts as any).map(e => e.lineChartData);
        });
    }

    // events
    public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        // console.log('chartClicked', event, active);
    }

    public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
        if (active.length > 0) {
            let index = active[0]['_index'];
            // this.charts.forEach((child, i) => {
            //     this.setAnnotation(child, index);
            // });
            this.setSelected(index);
        }
    }

    ngAfterViewInit(): void { }

    ngOnDestroy(): void { }

    calculateData(childChart, chart) {
        const observable = bindCallback(this.ioBrokerService.sendTo).bind(this.ioBrokerService);
        let obs$ = observable('influxdb.0', 'getHistory', {
            id: childChart.ioBrokerID,
            options: {
                start: childChart.from,
                end: childChart.to,
                step: childChart.step,
                limit: false,
                aggregate: 'average',
            }
        });
        obs$.subscribe((result) => {
            // console.log(result.result);
            let results = result.result.map(e => { return { x: new Date(e.ts), y: e.val } })
            let current = this.stateQuery.getEntity(childChart.ioBrokerID);
            childChart.overviewValue = {
                // current: results[results.length - 1],
                current: { x: new Date(current['ls']), y: current['val'] },
                max: results.find(e => e.y === Math.max(...results.map(e => e.y))),
                min: results.find(e => e.y === Math.min(...results.map(e => e.y))),
                selected: { x: '', y: '' },
            }
            childChart.lineChartData.data = results;
            if (childChart.ioBrokerID === 'jeelink.1.LaCrosseWS_balkon.rain') {
                // childChart.lineChartData.pointBackgroundColor = (context) => {
                //     var index = context.dataIndex;
                //     var value = context.dataset.data[index]['y'];
                //     return value < 0 ? 'blue' : 'red';
                // };
                let newResult = []
                results.forEach((e, i, a) => {
                    if (i === 0) {
                        newResult.push({ x: e.x, y: 0 })
                    } else {
                        newResult.push({ x: e.x, y: (e.y - a[i - 1].y) })
                    }
                });
                childChart.overviewValue = {
                    current: newResult[results.length - 1],
                    max: newResult.find(e => e.y === Math.max(...newResult.map(e => e.y))),
                    total: { x: '', y: newResult.map(e => e.y).reduce((a, c) => a + c) },
                    selected: { x: '', y: '' },
                }
                childChart.lineChartData.data = newResult;
                chart['lineChartType'] = 'bar';
            }
            this.ref.markForCheck();
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

    setSelected(pointIndex) {
        this.chartData.forEach(mChart => {
            mChart.childCharts.forEach(cChart => {
                cChart['overviewValue'].selected = cChart.lineChartData['data'][pointIndex];
            });
        });
    }

    setAnnotation(child, pointIndex) {
        if (child.datasets.length == 0) { return };
        let ds = child.datasets[0];
        let anno = {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            borderColor: 'orange',
            borderWidth: 2,
            label: {}
        }
        if (pointIndex <= ds.data.length / 2) {
            anno['label']['xAdjust'] = 70;
            anno['label']['yAdjust'] = -10;
        } else {
            anno['label']['xAdjust'] = -70;
            anno['label']['yAdjust'] = -10;
        }
        let time = ds.data[pointIndex]['x'];
        anno['value'] = time;
        child.chart.options['annotation'].annotations = [anno];
        child.chart.update();
    }

    resetAllZoomes(){
        this.charts.forEach((child) => {
            child.chart['resetZoom']();
        });
    }

    onPan ({ chart }) { 
        let ticksMinX = chart.options.scales.xAxes[0].ticks.min;
        let ticksMaxX = chart.options.scales.xAxes[0].ticks.max;
        this.charts.forEach((child, i) => {
            child.chart.options.scales.xAxes[0].ticks['min'] = ticksMinX;
            child.chart.options.scales.xAxes[0].ticks['max'] = ticksMaxX;
            child.chart.options.scales.xAxes[0]['times']['min'] = ticksMinX;
            child.chart.options.scales.xAxes[0]['times']['max'] = ticksMaxX;
            child.chart.update();
        })
    }
}