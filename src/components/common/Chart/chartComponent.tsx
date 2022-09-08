import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { useEffect, useState, useRef } from 'react'

export type iProps = {
    p_expired?: any
    p_market?: Idata
    p_claim?: any
    state?: any
    data?: []
    setP_Expired?: any
    setP_Market?: any
    setP_Claim?: any
    ref?: any
}

export type Idata = {
    value: any
    date: any
}

const handleTrendLine = (chart: am4charts.XYChart, p_claim: number) => {
    let trend = chart.series.push(new am4charts.LineSeries())
    trend.dataFields.valueY = 'value'
    trend.dataFields.dateX = 'date'
    trend.strokeWidth = 1.5
    trend.stroke = am4core.color('#c00')
    trend.strokeDasharray = '3,3'
    trend.defaultState.transitionDuration = 1

    let endPoint = new Date(chart.data[chart.data.length - 1]?.date)
    endPoint.setDate(endPoint.getDate() + 10)

    if (!p_claim) {
        trend.data = [
            {
                date: chart.data[0]?.date,
                value: chart.data[chart.data.length - 1]?.value,
            },
            {
                date: endPoint,
                value: chart.data[chart.data.length - 1]?.value,
            },
        ]
    }

    if (p_claim) {
        trend.data = [
            {
                date: chart.data[0]?.date,
                value: p_claim,
            },
            {
                date: endPoint,
                value: p_claim,
            },
        ]
    }
}

const handleTrendLineStatus = (chart: am4charts.XYChart, p_claim: number) => {
    let trend = chart.series.push(new am4charts.LineSeries())
    trend.dataFields.valueY = 'value'
    trend.dataFields.dateX = 'date'
    trend.strokeWidth = 1.5
    trend.stroke = am4core.color('#c00')
    trend.strokeDasharray = '3,3'
    trend.defaultState.transitionDuration = 1

    if (p_claim) {
        // const timeBegin = new Date(chart.data[chart.data.length - 1].date)
        const timeEnd = new Date()
        timeEnd.setDate(timeEnd.getDate() + 5)

        trend.data = [
            {
                date: chart.data[chart.data.length - 1].date,
                value: chart.data[chart.data.length - 1].value,
            },
            {
                date: timeEnd,
                value: p_claim,
            },
        ]
    }
}

const ChartComponent = ({ p_expired, p_market, p_claim, data, setP_Expired, setP_Market, setP_Claim, state }: iProps) => {
    const [dataChart, setDataChart] = useState([])
    let chart: any
    const ref = useRef<any>(null)

    useEffect(() => {
        if (data && data.length > 0) setDataChart(data)
    }, [data])

    useEffect(() => {
        InitChart(dataChart)
        ref.current.renderer
        setP_Market(chart.data[chart.data.length - 1]?.value)
    }, [dataChart, p_claim, p_expired, state.period])

    const InitChart = async (test_data: Idata[]) => {
        am4core.unuseTheme(am4themes_animated)
        chart = am4core.create('chartdiv', am4charts.XYChart)

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
            dateAxis.tooltip.disabled = true

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
            subSeries.data = [
                {
                    date: chart.data[chart.data.length - 1]?.date,
                    value: chart.data[chart.data.length - 1]?.value,
                },
            ]
            subSeries.dataFields.dateX = 'date'
            subSeries.dataFields.valueY = 'value'
            subSeries.interpolationDuration = 0

            // load data for chart sub
            // subSeries.data.push()

            //bullet main
            let bullet = subSeries.bullets.push(new am4charts.CircleBullet())
            bullet.circle.fill = am4core.color('#EB2B3E')
            bullet.stroke = am4core.color('#fff')
            bullet.circle.strokeWidth = 2
            bullet.circle.propertyFields.radius = '1'

            handleTrendLine(chart, p_claim)

            // //Label bullet main
            let latitudeLabel = subSeries.bullets.push(new am4charts.LabelBullet())
            latitudeLabel.label.text = `P-Market ${chart.data[chart.data.length - 1]?.value}`
            latitudeLabel.label.horizontalCenter = 'right'
            latitudeLabel.label.dx = 100
            latitudeLabel.label.dy = 15
            latitudeLabel.label.verticalCenter = 'top'
            latitudeLabel.label.fill = am4core.color('#B2B7BC')

            if (p_expired) {
                //chart Expired
                let latitudeExpired = chart.series.push(new am4charts.LineSeries())
                latitudeExpired.dataFields.dateX = 'date'
                latitudeExpired.dataFields.valueY = 'value'
                latitudeExpired.data = []
                subSeries.interpolationDuration = 0

                // load data for chart sub
                const t_expired = new Date()
                t_expired.setDate(state.t_market.getDate() + state.period)
                latitudeExpired.data.push({
                    date: t_expired,
                    value: p_expired,
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
                expiredLabel.label.dy = 30
                expiredLabel.label.verticalCenter = 'bottom'
                expiredLabel.label.fill = am4core.color('#B2B7BC')
            }

            if (p_claim) {
                //chart claim

                const timeBegin = new Date(chart.data[chart.data.length - 1]?.date)
                const timeEnd = new Date()
                timeEnd.setDate(timeEnd.getDate() + 5)

                let latitudeClaim = chart.series.push(new am4charts.LineSeries())
                latitudeClaim.dataFields.valueY = 'value'
                latitudeClaim.dataFields.dateX = 'date'
                latitudeClaim.data = [
                    {
                        date: timeEnd,
                        value: p_claim,
                    },
                ]

                let bulletClaim = latitudeClaim.bullets.push(new am4charts.CircleBullet())
                bulletClaim.fill = am4core.color('white')
                bulletClaim.stroke = am4core.color('#EB2B3E')

                let claimLabel = latitudeClaim.bullets.push(new am4charts.LabelBullet())
                claimLabel.label.horizontalCenter = 'left'
                claimLabel.label.dx = 20
                claimLabel.label.verticalCenter = 'middle'
                claimLabel.label.fill = am4core.color('#EB2B3E')
                claimLabel.label.html = `<div class="hover:cursor-pointer" style="color: #EB2B3E; border-radius: 800px; padding: 4px 16px; background-color: #FFF1F2">P-Claim ${p_claim}</div>`
                claimLabel.id = 'g2'

                //label claim
                claimLabel.label.draggable = true
                let interract = am4core.getInteraction()
                claimLabel.events.once('drag', (event: any) => {
                    interract.events.once('up', (e) => {
                        let point = am4core.utils.documentPointToSprite(e.pointer.point, chart.seriesContainer)
                        return setP_Claim(valueAxis.yToValue(point?.y))
                    })
                })

                handleTrendLineStatus(chart, p_claim)
            }

            //cursor
            chart.cursor = new am4charts.XYCursor()
            chart.cursor.lineX.disabled = true
            chart.cursor.behavior = 'none'
        }
    }

    return <div ref={ref} id="chartdiv" style={{ width: '100%', height: '500px' }} className={'relative'} />
}

export default ChartComponent