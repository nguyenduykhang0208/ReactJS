import React, { Component } from 'react';
import { connect } from "react-redux";
import { Bar, Doughnut, Pie } from 'react-chartjs-2';  // Import biểu đồ Bar từ react-chartjs-2
import './Analyst.scss'
import { Chart, registerables } from 'chart.js';
import { getGeneralStatistic, getMonthlyRevenue, getTopDoctorAndRevenue } from "../../../../services/userService";
Chart.register(...registerables);

class Analyst extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctor: '',
            patient: '',
            specialties: '',
            clinic: '',
            months: [
                { title: 'Trong 3 tháng', value: 3 },
                { title: 'Trong 6 tháng', value: 6 },
                { title: 'Trong năm', value: 12 }
            ],
            selected_months: '',
            selected_months_doctor: '',
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: '',
                        data: [],
                        backgroundColor: []
                    }
                ]
            },
            doctorBookingChart: {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: []
                    }
                ]
            },
            doctorRevenueChart: {
                labels: [],
                datasets: [
                    {
                        data: [],
                        backgroundColor: []
                    }
                ]
            },
            backgroundColor: [
                // 'rgba(153, 102, 255, 0.6)',
                // 'rgba(75, 192, 192, 0.6)',
                // 'rgba(75, 192, 192, 0.6)',
                // 'rgba(54, 162, 235, 0.6)',
                // 'rgba(255, 206, 86, 0.6)',
                // 'rgba(255, 159, 64, 0.6)'
                'rgba(255, 99, 132,1)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgba(153, 102, 255, 1)',
                'rgba(201, 203, 207, 1)',
                'rgba(255, 159, 64, 1)',
            ]
        }
    }

    getMonthlyRevenueData = async (month) => {
        let res = await getMonthlyRevenue(month);
        if (res && res.errCode === 0) {
            let { backgroundColor } = this.state;
            let data = res.data;
            let labels = data.map((item => item.month));
            let label_dataset = 'Doanh thu';
            let datasets_data = {
                label: label_dataset,
                data: data.map(item => parseFloat(item.monthly_revenue)),
                backgroundColor: data.map((_, index) => {
                    return backgroundColor[index % backgroundColor.length];
                })
            }
            this.setState({
                chartData: {
                    labels: labels,
                    datasets: [
                        datasets_data
                    ]
                }
            })
        }
    }

    getTopDoctorAndRevenueData = async (month) => {
        let res = await getTopDoctorAndRevenue(month);
        if (res && res.errCode === 0) {
            let { backgroundColor } = this.state;
            let doctorRevenue = res?.data?.doctorRevenue;
            let topDoctor = res?.data?.topDoctors;

            let doctorRevenueChart_labels = doctorRevenue.map(item =>
                `${item?.doctorInvoiceData?.User?.lastName} ${item?.doctorInvoiceData?.User?.firstName}`
            )
            let doctorRevenueChart_datasets = [{
                label: 'Doanh thu',
                data: doctorRevenue.map(item => parseFloat(item.total_revenue)),
                backgroundColor: doctorRevenue.map((_, index) => {
                    return backgroundColor[index % backgroundColor.length];
                })
            }]

            let topDoctor_labels = topDoctor.map(item =>
                `${item?.doctorBookingData?.lastName} ${item?.doctorBookingData?.firstName}`
            )
            let topDoctor_datasets = [{
                label: 'Số lịch khám',
                data: topDoctor.map(item => parseInt(item.booking_count)),
                backgroundColor: topDoctor.map((_, index) => {
                    return backgroundColor[index % backgroundColor.length];
                })
            }]


            this.setState({
                doctorRevenueChart: {
                    labels: doctorRevenueChart_labels,
                    datasets: doctorRevenueChart_datasets
                },
                doctorBookingChart: {
                    labels: topDoctor_labels,
                    datasets: topDoctor_datasets
                }
            });
        }
    }

    async componentDidMount() {
        let res = await getGeneralStatistic();
        if (res && res.errCode === 0) {
            this.setState({
                doctor: res?.data?.doctor,
                patient: res?.data?.patient,
                specialties: res?.data?.specialties,
                clinic: res?.data?.clinic,
                selected_months: 3,
                selected_months_doctor: 3
            })
        }
        await this.getMonthlyRevenueData(this.state.selected_months);
        await this.getTopDoctorAndRevenueData(this.state.selected_months_doctor)
    }

    handleOnChangeSelect = async (event, name) => {
        let copyState = { ...this.state };
        copyState[name] = event.target.value;
        this.setState({
            ...copyState
        },
            async () => {
                if (name === 'selected_months') {
                    await this.getMonthlyRevenueData(this.state.selected_months);
                }
                if (name === 'selected_months_doctor') {
                    await this.getTopDoctorAndRevenueData(this.state.selected_months_doctor);
                }
            }
        )

    }

    render() {
        let { doctor, patient, specialties, clinic, months } = this.state;
        console.log('check', this.state)
        return (
            <>
                <div className='analyst-container'>
                    <div className='container'>
                        <div className='title'>Thống kê tổng quan</div>
                        <div className='general__dashboard'>
                            <div className='box'>
                                <div className='left-content'>
                                    <p className='box__title'>Tổng số người dùng</p>
                                    <p className='box__number'>{patient}</p>
                                </div>
                                <div className='right-content'>
                                    <div className='box_img user_img'></div>
                                </div>
                            </div>
                            <div className='box'>
                                <div className='left-content'>
                                    <p className='box__title'>Tổng số bác sĩ</p>
                                    <p className='box__number'>{doctor}</p>
                                </div>
                                <div className='right-content'>
                                    <div className='box_img doctor_img'></div>
                                </div>
                            </div>
                            <div className='box'>
                                <div className='left-content'>
                                    <p className='box__title'>Tổng số chuyên khoa</p>
                                    <p className='box__number'>{specialties}</p>
                                </div>
                                <div className='right-content'>
                                    <div className='box_img specialty_img'></div>
                                </div>
                            </div>
                            <div className='box'>
                                <div className='left-content'>
                                    <p className='box__title'>Tổng số cơ sở y tế</p>
                                    <p className='box__number'>{clinic}</p>
                                </div>
                                <div className='right-content'>
                                    <div className='box_img facility_img'></div>
                                </div>
                            </div>

                        </div>

                        <div className='revenue__container'>
                            <div className='row'>
                                <div className=' col-4'>
                                    <select className='form-select' onChange={(event) => this.handleOnChangeSelect(event, 'selected_months')}>
                                        {months && months.length > 0 && months.map((item, index) => {
                                            return (
                                                <option key={index} value={item.value}>{item.title}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <Bar
                                    data={this.state.chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                    height={300}
                                    redraw
                                />
                            </div>
                            <p>Thống kê doanh thu theo tháng</p>
                        </div>
                        <div className='top-doctor__container'>
                            <p className='heading-text'>Top bác sĩ nhiều lịch khám và doanh thu</p>

                            <div className='row'>
                                <div className=' col-4'>
                                    <select className='form-select' onChange={(event) => this.handleOnChangeSelect(event, 'selected_months_doctor')}>
                                        {months && months.length > 0 && months.map((item, index) => {
                                            return (
                                                <option key={index} value={item.value}>{item.title}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className='doctor_chart'>
                                    <div className='left-chart'>
                                        <div>
                                            <Doughnut
                                                data={this.state.doctorBookingChart}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (tooltipItem) {
                                                                    let datasetLabel = tooltipItem.dataset.label || '';
                                                                    let value = tooltipItem.raw;  // Lấy giá trị của dữ liệu
                                                                    return `${datasetLabel}: ${value}`;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                                height={300}
                                                redraw
                                            />
                                        </div>
                                        <p>Theo lịch khám</p>

                                    </div>
                                    <div className='right-chart'>
                                        <div>
                                            <Pie
                                                data={this.state.doctorRevenueChart}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (tooltipItem) {
                                                                    let datasetLabel = tooltipItem.dataset.label || '';
                                                                    let value = tooltipItem.raw;
                                                                    let formattedValue = new Intl.NumberFormat('vi-VN', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    }).format(value);
                                                                    return `${datasetLabel}: ${formattedValue}`;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                                height={300}
                                                redraw

                                            />
                                        </div>
                                        <p>Theo doanh thu</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Analyst);
