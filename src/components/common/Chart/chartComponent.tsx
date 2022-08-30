import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { useEffect, useState } from 'react'

export type iProps = {
    p_expired?: Idata
    p_market?: Idata
    p_claim?: Idata
    data?: []
    setP_Expired?: any
    setP_Market?: any
    setP_Claim?: any
}

export type Idata = {
    value: any
    date: any
}

const timeMessage = (previous: any) => {
    const current = Date.now()
    const msPerMinute = 60 * 1000
    const msPerHour = msPerMinute * 60
    const msPerDay = msPerHour * 24
    const msPerMonth = msPerDay * 30
    const msPerYear = msPerDay * 365

    const elapsed = current - previous

    const date = new Date(previous)

    return date
}

const handleTrendLine = (hasDrawed: boolean, chart: am4charts.XYChart) => {
    let trend = chart.series.push(new am4charts.LineSeries())
    trend.dataFields.valueY = 'value'
    trend.dataFields.dateX = 'date'
    trend.strokeWidth = 1.5
    trend.stroke = am4core.color('#c00')
    trend.strokeDasharray = '3,3'
    trend.defaultState.transitionDuration = 1

    let endPoint = new Date(chart.data[chart.data.length - 1].date)
    endPoint.setDate(endPoint.getDate() + 30)

    if (!hasDrawed) {
        trend.data = [
            {
                date: chart.data[0].date,
                value: chart.data[chart.data.length - 1].value,
            },
            {
                date: endPoint,
                value: chart.data[chart.data.length - 1].value,
            },
        ]
    }

    if (hasDrawed) {
        trend.data = [
            {
                date: chart.data[0].date,
                value: p_claim?.value,
            },
            {
                date: p_claim?.date,
                value: p_claim?.value,
            },
        ]
    }
}

const handleTrendLineStatus = (chart: am4charts.XYChart) => {
    let trend = chart.series.push(new am4charts.LineSeries())
    trend.dataFields.valueY = 'value'
    trend.dataFields.dateX = 'date'
    trend.strokeWidth = 1.5
    trend.stroke = am4core.color('#c00')
    trend.strokeDasharray = '3,3'
    trend.defaultState.transitionDuration = 1

    if (p_claim) {
        trend.data = [
            {
                date: chart.data[chart.data.length - 1].date,
                value: chart.data[chart.data.length - 1].value,
            },
            {
                date: p_claim?.date,
                value: p_claim?.value,
            },
        ]
    }
}

const ChartComponent = ({ p_expired, p_market, p_claim, data, setP_Expired, setP_Market, setP_Claim }: iProps) => {
    const [dataChart, setDataChart] = useState([])

    useEffect(() => {
        if (data && data.length > 0) setDataChart(data)
    }, [data])

    useEffect(() => {
        if (dataChart && dataChart.length > 0) {
            InitChart(dataChart)
        }
    }, [dataChart])

    const InitChart = async (test_data: Idata[]) => {
        am4core.unuseTheme(am4themes_animated)
        let chart = am4core.create('chartdiv', am4charts.XYChart)

        if (chart) {
            chart.data = test_data
            chart.logo.appeared = false
            chart.padding(0, 15, 0, 15)

            let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
            dateAxis.renderer.grid.template.location = 0
            dateAxis.renderer.minGridDistance = 30
            dateAxis.dateFormats.setKey('second', 'ss')
            dateAxis.periodChangeDateFormats.setKey('second', '[bold]h:mm a')
            dateAxis.periodChangeDateFormats.setKey('minute', '[bold]h:mm a')
            dateAxis.periodChangeDateFormats.setKey('hour', '[bold]h:mm a')
            dateAxis.renderer.inside = true
            dateAxis.renderer.axisFills.template.disabled = true
            dateAxis.renderer.ticks.template.disabled = true
            dateAxis.hidden = true

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
            valueAxis.renderer.opposite = true
            // @ts-ignore
            valueAxis.tooltip.disabled = true
            valueAxis.interpolationDuration = 500
            valueAxis.rangeChangeDuration = 500
            valueAxis.renderer.inside = true
            valueAxis.renderer.minLabelPosition = 0.05
            valueAxis.renderer.maxLabelPosition = 0.95
            valueAxis.renderer.axisFills.template.disabled = true
            valueAxis.renderer.ticks.template.disabled = true
            valueAxis.hidden = true

            let series = chart.series.push(new am4charts.LineSeries())
            series.dataFields.dateX = 'date'
            series.dataFields.valueY = 'value'
            series.stroke = series.fill = am4core.color('#EB2B3E')
            series.interpolationDuration = 500
            series.defaultState.transitionDuration = 0
            series.tensionX = 0.8

            chart.events.on('datavalidated', function () {
                dateAxis.zoom({ start: 1 / 15, end: 1.2 }, false, true)
            })

            //chart sub
            let subSeries = chart.series.push(new am4charts.LineSeries())
            subSeries.data = []
            subSeries.dataFields.dateX = 'date'
            subSeries.dataFields.valueY = 'value'
            subSeries.interpolationDuration = 0

            // load data for chart sub
            subSeries.data.push({
                date: chart.data[chart.data.length - 1].date,
                value: chart.data[chart.data.length - 1].value,
            })

            //bullet main
            let bullet = subSeries.bullets.push(new am4charts.CircleBullet())
            bullet.circle.fill = am4core.color('#EB2B3E')
            bullet.stroke = am4core.color('#fff')
            bullet.circle.strokeWidth = 2
            bullet.circle.propertyFields.radius = '1'

            handleTrendLine(false, chart)

            // //Label bullet main
            // let latitudeLabel = subSeries.bullets.push(new am4charts.LabelBullet())
            // latitudeLabel.label.text = `P-Market ${chart.data[chart.data.length - 1].value}`
            // latitudeLabel.label.horizontalCenter = 'left'
            // latitudeLabel.label.dx = 14
            // latitudeLabel.label.verticalCenter = 'bottom'
            // latitudeLabel.label.fill = am4core.color('#B2B7BC')

            if (p_expired) {
                //chart Expired
                let latitudeExpired = chart.series.push(new am4charts.LineSeries())
                latitudeExpired.dataFields.dateX = 'date'
                latitudeExpired.dataFields.valueY = 'value'
                latitudeExpired.data = []

                // load data for chart sub
                subSeries.data.push({
                    date: p_expired?.date,
                    value: p_expired?.value,
                })

                //bullet expired
                let bulletExpired = latitudeExpired.bullets.push(new am4charts.CircleBullet())
                bulletExpired.height = am4core.percent(1)
                bulletExpired.width = am4core.percent(1)
                bulletExpired.fill = am4core.color('#EB2B3E')
                bulletExpired.stroke = am4core.color('white')

                //label expired
                let expiredLabel = latitudeExpired.bullets.push(new am4charts.LabelBullet())
                expiredLabel.label.text = `P-Expired ${latitudeExpired.data[0].value}`
                expiredLabel.label.horizontalCenter = 'middle'
                expiredLabel.label.dx = 50
                expiredLabel.label.verticalCenter = 'bottom'
                expiredLabel.label.fill = am4core.color('#B2B7BC')
            }

            if (p_claim) {
                //chart claim
                let latitudeClaim = chart.series.push(new am4charts.LineSeries())
                latitudeClaim.dataFields.valueY = 'value'
                latitudeClaim.dataFields.dateX = 'date'
                latitudeClaim.data = []

                let bulletClaim = latitudeClaim.bullets.push(new am4charts.CircleBullet())
                bulletClaim.fill = am4core.color('white')
                bulletClaim.stroke = am4core.color('#EB2B3E')

                let claimLabel = latitudeClaim.bullets.push(new am4charts.LabelBullet())
                claimLabel.label.horizontalCenter = 'left'
                claimLabel.label.dx = 20
                claimLabel.label.verticalCenter = 'middle'
                claimLabel.label.fill = am4core.color('#EB2B3E')
                claimLabel.label.html = `<div class="hover:cursor-pointer" style="color: #EB2B3E; border-radius: 800px; padding: 4px 16px; background-color: #FFF1F2">P-Claim ${123}</div>`
                claimLabel.id = 'g2'

                //label claim
                claimLabel.label.draggable = true
                let interract = am4core.getInteraction()
                claimLabel.events.once('drag', (event) => {
                    interract.events.once('up', (e) => {
                        let point = am4core.utils.documentPointToSprite(e.pointer.point, chart.seriesContainer)
                        return valueAxis.yToValue(point?.y)
                    })
                })

                handleTrendLineStatus(chart)
            }

            //cursor
            chart.cursor = new am4charts.XYCursor()
            chart.cursor.lineX.disabled = true
            chart.cursor.behavior = 'none'
        }
    }

    return <div id="chartdiv" style={{ width: '100%', height: '500px' }} className={'relative'} />
}

export default ChartComponent
