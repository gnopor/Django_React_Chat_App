import React from 'react';
import { NavLink } from 'react-router-dom';


const Contact = (props) => {

    return (
        <NavLink to={`${props.chatURL}`} style={{ color: '#fff' }}>
            <li className="contact">
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src={props.picURL} alt="" />
                    <div className="meta">
                        <p className="name">{`Channel group-${props.name}: ${props.numMessages} Messages`}</p>
                        <p className="preview">
                            {
                                props.participants.map((participant, i) => <span key={i}> {participant}</span>)
                            }
                        </p>
                    </div>
                </div>
            </li>
        </NavLink>
    )
}

export default Contact;