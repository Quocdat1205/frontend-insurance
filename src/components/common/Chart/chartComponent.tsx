import {Component} from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export type IData = [
    date: number | string,
    value: number | string
];

function createTrendLine(data: [{ date: Date; value: number }, { date: Date; value: number }], chart: any) {
    let trend = chart.series.push(new am4charts.LineSeries());
    trend.dataFields.valueY = "value";
    trend.dataFields.dateX = "date";
    trend.strokeWidth = 2
    trend.stroke = am4core.color("#c00");
    trend.data = data;
    trend.strokeDasharray = [4,3]
};

class ChartComponent extends Component {
    componentDidMount() {
        am4core.useTheme(am4themes_animated);

        // Create chart
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.padding(0, 15, 0, 15);
        chart.logo.appeared = false

        // Load external data
        chart.data = [{
            "date": new Date(2018, 3, 20),
            "value": 90
        }, {
            "date": new Date(2018, 3, 21),
            "value": 102
        }, {
            "date": new Date(2018, 3, 22),
            "value": 65
        }, {
            "date": new Date(2018, 3, 23),
            "value": 62
        }, {
            "date": new Date(2018, 3, 24),
            "value": 55
        }, {
            "date": new Date(2018, 3, 25),
            "value": 81,
            "disabled": false
        }];

        if(chart){
            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            // @ts-ignore
            dateAxis.tooltip.disabled = true
            dateAxis.hidden = true

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.renderer.opposite = true
            // @ts-ignore
            valueAxis.tooltip.disabled = true
            valueAxis.hidden = true

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.name = "Sales";
            series.tooltipText = "{valueY.value}";
            series.stroke= am4core.color("#EB2B3E");

            let subSeries = chart.series.push(new am4charts.LineSeries())
            subSeries.data = []
            subSeries.dataFields.dateX = "date";
            subSeries.dataFields.valueY = "subValue";
            subSeries.interpolationDuration = 0;

            subSeries.data.push({
                date: chart._data[chart._data.length-1].date,
                subValue: chart._data[chart._data.length-1].value
            })

            let bullet = subSeries.bullets.push(new am4charts.CircleBullet());
            bullet.disabled = false;
            bullet.propertyFields.disabled = "disabled";
            bullet.fill = am4core.color("#EB2B3E");
            bullet.stroke = am4core.color("#fff");
            bullet.draggable = false;

            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineX.disabled = true;
            chart.cursor.behavior = 'none'

            createTrendLine(
                [
                    {
                        "date": new Date(2018, 3, 20),
                        "value": 81
                    },
                    {
                        "date": new Date(2018, 3, 30),
                        "value": 81
                    }
                ]
                ,chart)
        }

    }

    render() {
        return (
            <>
                <div id="chartdiv" style={{ width: "100%", height: "500px" }} />
            </>
        );
    }

}

export default ChartComponent
