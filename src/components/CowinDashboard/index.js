import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationCoverage: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
  }

  componentDidMount() {
    this.getVaccinationStatus()
  }

  getVaccinationStatus = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    const data = await response.json()
    if (response.ok === true) {
      const updatedCoverage = data.last_7_days_vaccination.map(eachData => ({
        vaccineDate: eachData.vaccine_date,
        dose1: eachData.dose_1,
        dose2: eachData.dose_2,
      }))
      const updatedByAge = data.vaccination_by_age.map(eachData => ({
        age: eachData.age,
        count: eachData.count,
      }))
      const updatedByGender = data.vaccination_by_gender.map(eachData => ({
        count: eachData.count,
        gender: eachData.gender,
      }))
      this.setState({
        vaccinationCoverage: updatedCoverage,
        vaccinationByAge: updatedByAge,
        vaccinationByGender: updatedByGender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderVaccinationSuccessView = () => {
    const {
      vaccinationCoverage,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state
    return (
      <>
        <div className="chart">
          <h1 className="side">Vaccination Coverage</h1>
          <VaccinationCoverage vaccinationDetails={vaccinationCoverage} />
        </div>
        <div className="chart">
          <h1 className="side">Vaccination by gender</h1>
          <VaccinationByGender vaccinationGenderDetails={vaccinationByGender} />
        </div>
        <div className="chart">
          <h1 className="side">Vaccination by age</h1>
          <VaccinationByAge vaccinationAgeDetails={vaccinationByAge} />
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="fail-text">Something went wrong</h1>
    </div>
  )

  renderVaccinationStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderVaccinationSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-cont">
        <div className="responsive-cont">
          <div className="website-logo-cont">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-text">Co-WIN</h1>
          </div>
          <h1 className="heading">CoWIN Vaccination in India</h1>
          {this.renderVaccinationStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
