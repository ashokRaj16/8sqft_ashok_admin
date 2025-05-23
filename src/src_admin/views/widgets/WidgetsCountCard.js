import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { Link, useNavigate } from 'react-router-dom'
import { constant } from '../../utils/constant'
import _ from 'lodash'
import { formatCurrencyConvert } from '../../utils/commonHelper'

const WidgetsCountCard = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const navigate = useNavigate();

  const monthUserRange = Object.keys(props.userRangeCounts || {})
  const monthPropertyRange = Object.keys(props.propertyRangeCounts || {})

  const dataUserRange = Object.values(props.userRangeCounts || {})
  const dataPropertyRange = Object.values(props.propertyRangeCounts || {})

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      {/** user Count section */}
      <CCol sm={6} xl={6} xxl={4}>
        <CWidgetStatsA
          color="primary"
          value={<>{props.userCount || '-'}</>}
          title="Total Users"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={() => {
                    navigate('/member/')
                  }}>
                    Show Details
                </CDropdownItem>
                <CDropdownItem onClick={() => {
                    navigate('/member/')
                  }}>
                    View
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            // <CChartBar
            //   className="mt-3 mx-3"
            //   style={{ height: '100px' }}
            //   data={{
            //     labels: monthUserRange,
            //     datasets: [
            //       {
            //         label: 'User(s)',
            //         backgroundColor: 'rgba(255,255,255,.2)',
            //         borderColor: 'rgba(255,255,255,.55)',
            //         data: dataUserRange,
            //         barPercentage: 0.6,
            //       },
            //     ],
            //   }}
            //   options={{
            //     maintainAspectRatio: false,
            //     plugins: {
            //       legend: {
            //         display: false,
            //       },
            //     },
            //     scales: {
            //       x: {
            //         grid: {
            //           display: false,
            //           drawTicks: true,
            //         },
            //         ticks: {
            //           display: false,
            //         },
            //       },
            //       y: {
            //         border: {
            //           display: false,
            //         },
            //         grid: {
            //           display: false,
            //           drawBorder: false,
            //           drawTicks: false,
            //         },
            //         ticks: {
            //           display: false,
            //         },
            //       },
            //     },
            //   }}
            // />
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '100px' }}
              data={{
                labels: monthUserRange,
                datasets: [
                  {
                    label: 'Property(s)',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: dataUserRange,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -30,
                    max: 100,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>

      {/* Property count section */}
      <CCol sm={6} xl={6} xxl={4}>
        <CWidgetStatsA
          color="info"
          value={<>{props.propertyCount || '-'}</>}
          title="Total Property"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                  <CDropdownItem onClick={() => {
                    navigate('/properties/')
                  }}>Show Details</CDropdownItem>
                  <CDropdownItem onClick={() => {
                    navigate('/properties/')
                  }}>View</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '100px' }}
              data={{
                labels: monthPropertyRange,
                datasets: [
                  {
                    label: 'User(s)',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: dataPropertyRange,
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: true,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }} />
            // <CChartLine
            //   ref={widgetChartRef2}
            //   className="mt-3 mx-3"
            //   style={{ height: '100px' }}
            //   data={{
            //     labels: monthPropertyRange,
            //     datasets: [
            //       {
            //         label: 'Property(s)',
            //         backgroundColor: 'transparent',
            //         borderColor: 'rgba(255,255,255,.55)',
            //         pointBackgroundColor: getStyle('--cui-info'),
            //         data: dataPropertyRange,
            //       },
            //     ],
            //   }}
            //   options={{
            //     plugins: {
            //       legend: {
            //         display: false,
            //       },
            //     },
            //     maintainAspectRatio: false,
            //     scales: {
            //       x: {
            //         border: {
            //           display: false,
            //         },
            //         grid: {
            //           display: false,
            //           drawBorder: false,
            //         },
            //         ticks: {
            //           display: false,
            //         },
            //       },
            //       y: {
            //         min: -30,
            //         max: 200,
            //         display: false,
            //         grid: {
            //           display: false,
            //         },
            //         ticks: {
            //           display: false,
            //         },
            //       },
            //     },
            //     elements: {
            //       line: {
            //         borderWidth: 1,
            //       },
            //       point: {
            //         radius: 4,
            //         hitRadius: 10,
            //         hoverRadius: 4,
            //       },
            //     },
            //   }}
            // />
          }
        />
      </CCol>

      {/* <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={
            <>
              { constant.CURRENCY_SYMBOL + ' ' + formatCurrencyConvert(6200) }

              <span className="fs-6 fw-normal">
                (40.9% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Income"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View</CDropdownItem>
                <CDropdownItem>Show Details</CDropdownItem>
                <CDropdownItem>Share</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              ref={widgetChartRef2}
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: monthUserRange,
                // ['January 2025', 'February 2025', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: dataUserRange,
                    // [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol> */}

      {/* <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={
            <>
              2.49%{' '}
              <span className="fs-6 fw-normal">
                (84.7% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Conversion Rate"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View</CDropdownItem>
                <CDropdownItem>Show Details</CDropdownItem>
                <CDropdownItem>Share</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol> */}

      {/* 
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={
            <>
              44K{' '}
              <span className="fs-6 fw-normal">
                (-23.6% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Sessions"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View</CDropdownItem>
                <CDropdownItem>Show Details</CDropdownItem>
                <CDropdownItem>Share</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    border: {
                      display: false,
                    },
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol> */}
    </CRow>
  )
}

WidgetsCountCard.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
  userTotalCounts: PropTypes.number,
  propertyTotalCount: PropTypes.number,
  userRangeCounts: PropTypes.object,
  propertyRangeCounts: PropTypes.object,
  revenueTotalCount: PropTypes.number,
}

export default WidgetsCountCard
