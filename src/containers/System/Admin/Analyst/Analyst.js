import React, { Component } from 'react';
import { connect } from "react-redux";
import './Analyst.scss'
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

class Analyst extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialty: {},
            currentSpecialtyId: -1
        }
    }
    async componentDidMount() {
        // if (this.props.match?.params?.id) {
        //     let id = this.props.match.params.id;
        //     this.setState({
        //         currentSpecialtyId: id
        //     })
        //     await this.props.getDetailDoctorStart(id);
        // }
    }

    componentDidUpdate(prevProps, preState) {
        // if (prevProps.detailDoctor !== this.props.detailDoctor) {
        //     this.setState({
        //         specialty: this.props.detailDoctor
        //     })
        // }
    }
    render() {
        return (
            <>
                <div className='analyst-container'>
                    <div className='title'>Thống kê tổng quan</div>
                    {/* <Doughnut data={1, 2, 3, 4} /> */}

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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Analyst);
