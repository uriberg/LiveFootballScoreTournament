import React from 'react'
// @ts-ignore
import SocialLogin from 'react-social-login';

interface socialProps {
    triggerLogin: () => void
}

class SocialButton extends React.Component<socialProps> {

    render() {
        return (
            <button onClick={this.props.triggerLogin} {...this.props}>
                { this.props.children }
            </button>
        );
    }
}

export default SocialLogin(SocialButton);
