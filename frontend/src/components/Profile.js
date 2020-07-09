import React from 'react';
import { connect } from 'react-redux';
//import { Redirect } from 'react-router-dom';

import Hoc from '../hoc/hoc';
import Current_user from '../assets/current_user.webp';

class Profile extends React.Component {
    render() {
        /*         if (this.props.token === null) {
                    console.log(this.props);
                    return <Redirect to="/" />;
                } */
        return (
            <div className="contact-profile">
                {
                    this.props.username !== null ?

                        <Hoc>
                            <img src={Current_user} alt="" />
                            <p>{this.props.username}</p>
                            <div className="social-media">
                                <i className="fa fa-facebook" aria-hidden="true"></i>
                                <i className="fa fa-twitter" aria-hidden="true"></i>
                                <i className="fa fa-instagram" aria-hidden="true"></i>
                            </div>
                        </Hoc>

                        :

                        null
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        username: state.auth.username,
        token: state.auth.token
    };
};

export default connect(mapStateToProps)(Profile);