import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { throttle, debounce } from 'lodash'

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
    isMobile?: boolean
    width: number
    height: number
}

export type Idata = {
    value: any
    date: any
}

export const handleTrendLine = (chart: am4charts.XYChart, p_claim: number, state: any) => {
    let trend = chart.series.push(new am4charts.LineSeries())
    trend.dataFields.valueY = 'value'
    trend.dataFields.dateX = 'date'
    trend.strokeWidth = 1.5
    if (state.p_claim < state.p_market) {
        trend.stroke = am4core.color('#EB2B3E')
    } else {
        trend.stroke = am4core.color('#52CC74')
    }
    if (state.p_claim == state.p_market || state.p_claim == 0) {
        trend.stroke = am4core.color('#22313F')
    }

    trend.strokeDasharray = '3,3'
    trend.defaultState.transitionDuration = 1

    let endPoint = new Date(chart.data[chart.data.length - 1]?.date)
    endPoint.setDate(endPoint.getDate() + 8)

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

export const handleTrendLineStatus = (chart: am4charts.XYChart, p_claim: number, state: any) => {
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
        timeEnd.setDate(timeEnd.getDate() + 4)

        trend.data = [
            {
                date: chart.data[chart.data.length - 1]?.date,
                value: chart.data[chart.data.length - 1]?.value,
            },
            {
                date: timeEnd,
                value: p_claim,
            },
        ]
    }
}

const ChartComponent = ({ p_expired, p_claim, data, setP_Market, setP_Claim, state, isMobile, width, height }: iProps) => {
    const [dataChart, setDataChart] = useState([])
    const [PClaim, setPClaim] = useState(p_claim)
    const router = useRouter()
    let chart: any
    // const ref = useRef<any>(null)

    useEffect(() => {
        if (data && data.length > 0) setDataChart(data)
    }, [data])

    useEffect(() => {
        InitChart(dataChart)
    }, [dataChart])

    const timer = useRef<any>(null)
    useEffect(() => {
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            InitChart(dataChart)
        }, 500)
        if (chart) {
            setP_Market(chart.data[chart.data.length - 1]?.value)
            setPClaim(PClaim)
        }
    }, [dataChart, p_claim, p_expired, state.period])

    // useEffect(() => {
    //     InitChart(dataChart)
    // }, [data])

    const InitChart = async (test_data: Idata[]) => {
        am4core.unuseTheme(am4themes_animated)
        chart = am4core.create('chartdiv', am4charts.XYChart)
        chart.updateCurrentData = true

        if (chart) {
            chart.responsive.enabled = true
            chart.data = test_data
            chart.logo.appeared = false
            chart.padding(0, 15, 0, 15)
            chart.swipeable = true

            //cursor
            chart.cursor = new am4charts.XYCursor()
            chart.cursor.lineX.disabled = true
            chart.cursor.behavior = 'none'
            chart.cursor.fullWidthLineX = true
            chart.cursor.fullWidthLineY = true
            chart.cursor.lineX.fillOpacity = 0.05
            chart.cursor.lineY.fillOpacity = 0.05
            chart.events.on('ready', function (event: any) {
                valueAxis.min = valueAxis.minZoomed
                valueAxis.max = valueAxis.maxZoomed
            })

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
            dateAxis.renderer.minLabelPosition = 1000
            dateAxis.renderer.maxLabelPosition = 10

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
            valueAxis.tooltip.disabled = true

            chart.events.on('datavalidated', function () {
                dateAxis.zoom({ start: 1 / 500, end: 1.1 }, false, true)
            })

            // let gradient = new am4core.LinearGradient()
            // gradient.addColor(am4core.color('#EB2B3E'), 0.15, 0)
            // gradient.addColor(am4core.color('#EB2B3E'), 1, 1)
            // gradient.rotation = 270

            let series = chart.series.push(new am4charts.LineSeries())
            series.dataFields.dateX = 'date'
            series.dataFields.valueY = 'value'
            series.stroke = series.fill = am4core.color('#EB2B3E')
            series.interpolationDuration = 500
            series.defaultState.transitionDuration = 0
            series.tensionX = 0.8
            series.focusable = true
            series.fullWidthLineX = 0.05
            series.fullWidthLineY = 0.05
            series.fillOpacity = 0.25
            // series.fill = gradient

            // series.fillOpacity = 1
            let gradient = new am4core.LinearGradient()
            gradient.addColor(am4core.color('#EB2B3E'), 1, 1)
            gradient.addColor(am4core.color('#EB2B3E'), 0, 0)
            gradient.addColor(am4core.color('#EB2B3E'), 1, 1)
            gradient.addColor(am4core.color('#EB2B3E'), 0, 0)
            gradient.rotation = 90
            series.fill = gradient

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

            if (
                (p_claim > state.p_market * 1 + (2 * state.p_market) / 100 && p_claim < state.p_market * 1 + (70 * state.p_market) / 100) ||
                (p_claim > state.p_market * 1 - (70 * state.p_market) / 100 && p_claim < state.p_market * 1 - (2 * state.p_market) / 100)
            ) {
                handleTrendLine(chart, p_claim, state)
            } else {
                handleTrendLine(chart, 0, state)
            }

            // //Label bullet main
            let latitudeLabel = subSeries.bullets.push(new am4charts.LabelBullet())
            latitudeLabel.label.html = `<div class="text-xs">P-Market: $${chart.data[chart.data.length - 1]?.value}</div>`
            latitudeLabel.label.horizontalCenter = 'right'
            latitudeLabel.label.dx = 100
            latitudeLabel.label.dy = -5
            latitudeLabel.label.verticalCenter = 'bottom'
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
                t_expired.setDate(state.t_market.getDate() + 4)
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
                console.log(latitudeExpired.data[0].value, 'thuc')
                if (state.p_claim && state.q_covered) {
                    expiredLabel.label.html = `<div class="text-xs">P-Expired: $${latitudeExpired.data[0].value}</div>`
                } else {
                    bulletExpired.disabled = true
                }

                expiredLabel.label.horizontalCenter = 'middle'
                expiredLabel.label.dy = latitudeExpired.data[0].value > state.p_market ? 23 : -23
                expiredLabel.label.verticalCenter = 'bottom'
                expiredLabel.label.fill = am4core.color('#B2B7BC')
            }

            if (
                (p_claim > state.p_market * 1 + (2 * state.p_market) / 100 && p_claim < state.p_market * 1 + (70 * state.p_market) / 100) ||
                (p_claim > state.p_market * 1 - (70 * state.p_market) / 100 && p_claim < state.p_market * 1 - (2 * state.p_market) / 100)
            ) {
                const timeEnd = new Date()
                timeEnd.setDate(timeEnd.getDate() + 4)

                let latitudeClaim = chart.series.push(new am4charts.LineSeries())
                latitudeClaim.dataFields.valueY = 'value'
                latitudeClaim.dataFields.dateX = 'date'
                latitudeClaim.data = [
                    {
                        date: timeEnd,
                        value: p_claim > 0 ? p_claim : state.p_market,
                    },
                ]

                let subLatitudeClaim = chart.series.push(new am4charts.LineSeries())
                subLatitudeClaim.dataFields.dateX = 'date'
                subLatitudeClaim.dataFields.valueY = 'value'
                subLatitudeClaim.stroke = am4core.color('rgba(0, 0, 0, 0)')
                subLatitudeClaim.stroke.opacity = 0
                subLatitudeClaim.fullWidthLineX = 0.05
                subLatitudeClaim.fullWidthLineY = 0.05
                subLatitudeClaim.fillOpacity = 0.25
                subLatitudeClaim.fill = gradient
                subLatitudeClaim.data = [
                    ...dataChart,
                    {
                        date: timeEnd,
                        value: p_claim > 0 ? p_claim : state.p_market,
                    },
                ]
                series.fillOpacity = 0
                subLatitudeClaim.fill = gradient

                let bulletClaim = latitudeClaim.bullets.push(new am4charts.CircleBullet())
                bulletClaim.fill = am4core.color('white')
                bulletClaim.stroke = am4core.color(
                    `${latitudeClaim.data[0].value < state.p_market ? '#EB2B3E' : latitudeClaim.data[0].value > state.p_market ? '#52CC74' : '#808890'}`,
                )
                bulletClaim.properties.alwaysShowTooltip = true

                let claimLabel = latitudeClaim.bullets.push(new am4charts.LabelBullet())
                claimLabel.label.horizontalCenter = 1
                claimLabel.label.fill = am4core.color('#EB2B3E')
                claimLabel.label.html = ''
                claimLabel.label.draggable = false
                claimLabel.label.position = [0, 0]
                claimLabel.label.dy = latitudeClaim.data[0].value > state.p_market ? 20 : -20
                if (isMobile) {
                    claimLabel.label.dx = -90
                }

                console.log(state.p_market, state.p_claim)

                const percent = (((state.p_claim - state.p_market) / state.p_market) * 100).toFixed(2)

                if (p_claim > 0) {
                    if (isMobile) {
                        claimLabel.label.html = `<div id="claimLabel" class="justify-end mt-[0.25rem] hover:cursor-pointer items-center flex text-xs h-[24px] text-[${
                            latitudeClaim.data[0].value < state.p_market ? '#EB2B3E' : '#52CC74'
                        }] "><span>P-Claim: $${
                            latitudeClaim.data[0].value
                        }</span><span class="ml-[8px] h-[24px] py-[2px] px-[8px] items-center border rounded-full bg-[${
                            latitudeClaim.data[0].value < state.p_market ? '#FFF1F2' : '#F1FFF5'
                        }]">${percent}%</span></div>`
                    } else {
                        claimLabel.label.html = `<div id="claimLabel" class="hover:cursor-pointer text-sm z-[1000]" style="color: ${
                            latitudeClaim.data[0].value < state.p_market ? '#EB2B3E' : '#52CC74'
                        } ; border-radius: 800px; padding: 4px 16px; background-color: ${
                            latitudeClaim.data[0].value < state.p_market ? '#FFF1F2' : '#F1FFF5'
                        }  "><span class="mr-[8px]">P-Claim: $${latitudeClaim.data[0].value}</span> <span> ${percent}%
                        </span></div>`
                    }
                }
                if (p_claim == state.p_market) {
                    if (!isMobile) {
                        claimLabel.label.html = `<div id="claimLabel" class="hover:cursor-pointer text-[#808890] text-sm z-[1000] bg-[#F7F8FA] rounded-[800px] px-[16px] py-[4px]"><span class="mr-[8px]">P-Claim ${latitudeClaim.data[0].value}</span> <span>0%</span></div>`
                    }
                    claimLabel.label.html = `<div id="claimLabel" class="hover:cursor-pointer items-center flex text-[#808890] text-xs z-[1000]"><span class="mr-[8px]">P-Claim ${latitudeClaim.data[0].value}</span><span class="bg-[#F8F8F8]  rounded-[800px] px-[8px] py-[2px]">0%</span></div>`
                }

                claimLabel.events.on('drag', (event: any) => {
                    let value = valueAxis.yToValue(event.target.pixelY).toFixed(2)
                    event.target.dataItem.valueY = value
                    const claimLabel = document.getElementById('claimLabel')
                    if (claimLabel) {
                        if (value < state.p_market) {
                            // claimLabel.style.color = '#EB2B3E'
                            // claimLabel.style.backgroundColor = '#FFF1F2'
                            claimLabel.innerHTML = `P-Claim: $${value} ${(((value - state.p_market) / state.p_market) * 100).toFixed(2)}%`
                        } else {
                            // claimLabel.style.color = '#52CC74'
                            // claimLabel.style.backgroundColor = '#F1FFF5'
                            claimLabel.innerHTML = `P-Claim: $${value} ${(((value - state.p_market) / state.p_market) * 100).toFixed(2)}%`
                        }
                    }
                })

                claimLabel.events.on('dragstop', (event: any) => {
                    let value = valueAxis.yToValue(event.target.pixelY)
                    setP_Claim(value)
                })

                // if (isMobile) {
                //     chart.events.once('down', (e: any) => {
                //         chart.cursor.events.on('cursorpositionchanged', function (ev: any) {
                //             let yAxis = ev.target.chart.yAxes.getIndex(0)
                //             const value = yAxis.positionToValue(yAxis.toAxisPosition(ev.target.yPosition)).toFixed(2)
                //             const claimLabel = document.getElementById('claimLabel')

                //             if (claimLabel) {
                //                 if (value < state.p_market) {
                //                     claimLabel.style.color = '#EB2B3E'
                //                     claimLabel.style.backgroundColor = '#FFF1F2'
                //                     claimLabel.innerHTML = `P-Claim: $${value} ${(((value - state.p_market) / state.p_market) * 100).toFixed(2)}%`
                //                 } else {
                //                     claimLabel.style.color = '#52CC74'
                //                     claimLabel.style.backgroundColor = '#F1FFF5'
                //                     claimLabel.innerHTML = `P-Claim: $${value} ${(((value - state.p_market) / state.p_market) * 100).toFixed(2)}%`
                //                 }
                //             }
                //             if (ev) {
                //                 chart.events.once('up', (e: any) => {
                //                     setP_Claim(value)
                //                 })
                //             }
                //         })
                //     })
                // }

                handleTrendLineStatus(chart, p_claim, state)
            }
        }
    }

    return <div id="chartdiv" className="relative" style={{ width: `100%`, height: `${height}px` }}></div>
}

export default ChartComponent
