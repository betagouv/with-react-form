import PropTypes from 'prop-types'
import React from 'react'

import getForm from './getForm'

const withForm = WrappedComponent => {
  const WrappingComponent = props => (
    <WrappedComponent
      form={getForm(props)}
      {...props}
    />
  )

  WrappingComponent.defaultProps = {
    name: null
  }

  WrappingComponent.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape().isRequired
    }).isRequired,
    name: PropTypes.string,
  }

  return WrappingComponent
}

export default withForm
