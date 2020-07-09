import React, { useState, useEffect } from 'react';
import { Form, Select, Button } from 'antd';
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as navActions from "../store/actions/nav";
import * as messageActions from "../store/actions/message";
import { HOST_URL } from "../settings";


const AddChatForm = (props) => {
    const [form] = Form.useForm();
    const [usernames, setUsernames] = useState([]);
    const [, forceUpdate] = useState();

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const handleChange = value => {
        setUsernames(value);
    };


    const handleSubmit = e => {

        const combined = [...usernames, props.username];
        console.log(combined);
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${props.token}`
        };
        axios
            .post(`${HOST_URL}/chat/create/`, {
                messages: [],
                participants: combined
            })
            .then(res => {
                props.history.push(`/${res.data.id}`);
                props.closeAddChatPopup();
                props.getUserChats(props.username, props.token);
            })
            .catch(err => {
                console.error(err);
            });


    };

    return (
        <Form form={form} name="horizontal_login" layout="inline" onFinish={handleSubmit}>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Tags Mode"
                    onChange={handleChange}
                >
                    {[]}
                </Select>
            </Form.Item>
            <Form.Item shouldUpdate={true}>
                {() => (
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                            !form.isFieldsTouched(true) ||
                            form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                    >
                        Start a chat
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
}



const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
        closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup()),
        getUserChats: (username, token) =>
            dispatch(messageActions.getUserChats(username, token))
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AddChatForm)
);