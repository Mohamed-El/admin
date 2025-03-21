import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAvatar,
  CBadge,
  CImage,
  CTableBody,
  CTableRow,
  CNav,
  CNavItem,
  CNavLink,
  CTableDataCell,
  CTable,
  CFormSelect,
} from '@coreui/react'

const ENDPOINT = 'http://localhost:5000' // Your server URL

const tabOptions = {
  administration: ['Cash', 'Bank', 'Invoice', 'LIP', 'TB', 'VAT', 'ICP', 'Salary', 'CBS'],
  backoffice: ['Pay', 'Billing', 'Report', 'Mail'],
  audit: ['FS', 'Hours', 'Deadlines'],
  advisory: ['ProjectHours', 'Deadlines'],
  yearwork: ['IB', 'FS', 'VPB', 'SUP', 'KVK'],
}

const enumValues = ['N/A', 'O', 'DN', 'W', 'P', 'R', 'D', 'A', 'C']

const CompanyDetailPage = () => {
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [activeTab, setActiveTab] = useState('administration')
  const [tabData, setTabData] = useState({})

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${ENDPOINT}/client/${clientId}`)
        const data = await response.json()
        setClient(data)
        fetchTeamMembers(data.TeamId)
      } catch (error) {
        console.error('Error fetching company details:', error)
      }
    }

    fetchCompanyDetails()
  }, [clientId])

  useEffect(() => {
    if (client) {
      fetchTabData(activeTab)
    }
  }, [client, activeTab])

  const fetchTeamMembers = async (teamId) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/teams/${teamId}`)
      const data = await response.json()
      setTeamMembers(data.members)
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const fetchTabData = async (tab) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/${tab}/${clientId}`)
      const data = await response.json()
      setTabData(data)
    } catch (error) {
      console.error(`Error fetching data for ${tab}:`, error)
    }
  }

  const extractInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <>
      {client && (
        <>
          <CRow>
            <CCol sm={8}>
              <CCard>
                <CCardHeader>Company Logo</CCardHeader>
                <CCardBody>
                  <CRow className="align-items-center">
                    <CCol md="6">
                      <CImage
                        src={`${ENDPOINT}/uploads/${client.Logo}`}
                        alt="Client Logo"
                        rounded
                        thumbnail
                        width="200"
                        height="200"
                      />
                    </CCol>
                    <CCol md="6">
                      <CAvatar color="primary" textColor="white">
                        {extractInitials(client.Owner)}
                      </CAvatar>
                      {client.Owner}
                    </CCol>
                  </CRow>
                  <CBadge
                    color={
                      client.Category === 'Key Client'
                        ? 'success'
                        : client.Category === 'Client'
                          ? 'info'
                          : client.Category === 'Exit Client'
                            ? 'danger'
                            : client.Category === 'On Hold'
                              ? 'warning'
                              : 'primary'
                    }
                    shape="rounded-pill"
                  >
                    {client.Category}
                  </CBadge>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol xs={4}>
              <CCard>
                <CCardHeader>Team Members</CCardHeader>
                <CCardBody>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="mb-2">
                      <CAvatar color="primary" textColor="white" className="me-2">
                        {extractInitials(member.Name)}
                      </CAvatar>
                      {member.Name}
                    </div>
                  ))}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow className="mb-4">
            <CCol xs={4}>
              <CCard>
                <CCardHeader>Pie Chart</CCardHeader>
                <CCardBody>{/* Placeholder for Pie Chart */}</CCardBody>
              </CCard>
            </CCol>
            <CCol sm={8}>
              <CCard>
                <CCardHeader>
                  <CNav variant="tabs">
                    {Object.keys(tabOptions).map((tab) => (
                      <CNavItem key={tab}>
                        <CNavLink active={activeTab === tab} onClick={() => handleTabChange(tab)}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </CNavLink>
                      </CNavItem>
                    ))}
                  </CNav>
                </CCardHeader>
                <CCardBody>
                  <CTable>
                    <CTableBody>
                      {tabOptions[activeTab].map((option) => (
                        <CTableRow key={option}>
                          <CTableDataCell>
                            <label>{option}</label>
                            <CFormSelect value={tabData[option]}>
                              {enumValues.map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </CFormSelect>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default CompanyDetailPage
