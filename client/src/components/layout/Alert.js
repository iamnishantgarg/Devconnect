import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

export const Alert = ({ alerts }) => {
  return (
    alerts != null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ))
  );
};

Alert.propTypes = {
  prop: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alert,
});

// const mapDispatchToProps = {};

export default connect(mapStateToProps)(Alert);
